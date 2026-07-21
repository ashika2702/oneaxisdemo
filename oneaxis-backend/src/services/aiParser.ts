import OpenAI from 'openai';
import { logger } from '../utils/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface ParsedPlan {
  floors: number;
  units: Array<{
    unit_number: string;
    floor: number;
    type: string;
    area: number;
    bedrooms: number;
    bathrooms: number;
  }>;
  dimensions: {
    width: number;
    depth: number;
    total_area: number;
  };
  elements: string[];
  confidence: number;
}

export async function parsePlanImage(imageBase64: string): Promise<ParsedPlan> {
  if (!process.env.OPENAI_API_KEY) {
    logger.warn('No OpenAI API key configured, returning mock data');
    return getMockParsedData();
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an architectural plan analyzer. Extract structured data from floor plans.
          Return ONLY valid JSON with this exact structure:
          {
            "floors": number,
            "units": [{"unit_number": "string", "floor": number, "type": "string", "area": number, "bedrooms": number, "bathrooms": number}],
            "dimensions": {"width": number, "depth": number, "total_area": number},
            "elements": ["string"],
            "confidence": number (0-1)
          }`,
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this architectural floor plan and extract all unit data, dimensions, and building elements.' },
            { type: 'image_url', image_url: { url: `data:image/png;base64,${imageBase64}` } },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.2,
    });

    const content = response.choices[0].message.content || '{}';
    // Extract JSON from possible markdown code block
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/({[\s\S]*})/);
    const jsonStr = jsonMatch ? jsonMatch[1] : content;
    const result = JSON.parse(jsonStr) as ParsedPlan;

    logger.info(`AI parsed plan: ${result.floors} floors, ${result.units.length} units`);
    return result;
  } catch (err) {
    logger.error('AI parsing failed, using fallback', err);
    return getMockParsedData();
  }
}

export async function chatWithProject(
  message: string,
  projectContext: any
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return `I'm a simulated AI assistant. In production with OpenAI, I would answer: "${message}" using your project data.`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are OneAxis AI, a project intelligence assistant. You help users understand their real estate and construction projects.
          Current project: ${projectContext.name}
          Type: ${projectContext.type}
          Units: ${projectContext.units?.length || 0}
          Available: ${projectContext.units?.filter((u: any) => u.status === 'available').length || 0}
          Be concise, professional, and data-driven.`,
        },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || 'I could not process that request.';
  } catch (err) {
    logger.error('Chat error', err);
    return 'Sorry, I encountered an error. Please try again.';
  }
}

function getMockParsedData(): ParsedPlan {
  return {
    floors: 12,
    units: Array.from({ length: 48 }, (_, i) => ({
      unit_number: `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`,
      floor: Math.floor(i / 4) + 1,
      type: ['Studio', '1-Bedroom', '2-Bedroom', '3-Bedroom'][i % 4],
      area: [45, 65, 90, 120][i % 4],
      bedrooms: [0, 1, 2, 3][i % 4],
      bathrooms: [1, 1, 2, 2][i % 4],
    })),
    dimensions: { width: 42, depth: 28, total_area: 15600 },
    elements: ['Walls', 'Floors', 'Columns', 'Windows', 'Doors', 'MEP', 'Elevator Shaft'],
    confidence: 0.85,
  };
}

export { openai };
