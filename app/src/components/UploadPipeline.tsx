import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Image, FileSpreadsheet, FileCode2, Box,
  CheckCircle, AlertTriangle, Loader2, Sparkles, Layers,
  Zap, Eye, Download, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type FileType = 'pdf' | 'image' | 'cad' | 'bim' | 'excel' | 'unknown';
type ProcessingStage = 'uploading' | 'detecting' | 'parsing' | 'extracting' | 'generating' | 'complete' | 'error';

interface UploadedFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  progress: number;
  stage: ProcessingStage;
  stageMessage: string;
  result?: {
    floors?: number;
    units?: number;
    area?: number;
    elements?: string[];
  };
}

const fileTypeConfig: Record<FileType, { icon: any; color: string; label: string; extensions: string[] }> = {
  pdf: { icon: FileText, color: '#ef4444', label: 'PDF Document', extensions: ['.pdf'] },
  image: { icon: Image, color: '#3b82f6', label: 'Image', extensions: ['.jpg', '.jpeg', '.png', '.tif', '.tiff'] },
  cad: { icon: FileCode2, color: '#f59e0b', label: 'CAD Drawing', extensions: ['.dwg', '.dxf', '.dgn'] },
  bim: { icon: Box, color: '#10b981', label: 'BIM Model', extensions: ['.rvt', '.ifc', '.skp', '.stp', '.step'] },
  excel: { icon: FileSpreadsheet, color: '#22c55e', label: 'Spreadsheet', extensions: ['.xlsx', '.xls', '.csv'] },
  unknown: { icon: FileText, color: '#6b7280', label: 'Unknown', extensions: [] },
};

function detectFileType(name: string): FileType {
  const ext = name.toLowerCase().slice(name.lastIndexOf('.'));
  for (const [type, config] of Object.entries(fileTypeConfig)) {
    if (config.extensions.includes(ext)) return type as FileType;
  }
  return 'unknown';
}

const stageMessages: Record<ProcessingStage, string> = {
  uploading: 'Uploading to secure storage...',
  detecting: 'Detecting file type and format...',
  parsing: 'Parsing document structure with AI...',
  extracting: 'Extracting geometry and dimensions...',
  generating: 'Generating 3D model and BOM...',
  complete: 'Processing complete! Ready to view.',
  error: 'Processing failed. Please try again.',
};

export default function UploadPipeline({ onComplete }: { onComplete: () => void }) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: UploadedFile) => {
    const stages: ProcessingStage[] = ['uploading', 'detecting', 'parsing', 'extracting', 'generating', 'complete'];
    
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, stage, stageMessage: stageMessages[stage], progress: Math.round((i / (stages.length - 1)) * 100) }
          : f
      ));
      // Simulate processing time
      const delay = stage === 'parsing' ? 2000 : stage === 'generating' ? 3000 : 800;
      await new Promise(r => setTimeout(r, delay));
    }

    // Set mock results
    setFiles(prev => prev.map(f => 
      f.id === file.id 
        ? { 
            ...f, 
            stage: 'complete', 
            stageMessage: stageMessages.complete,
            progress: 100,
            result: {
              floors: Math.floor(Math.random() * 15) + 5,
              units: Math.floor(Math.random() * 60) + 20,
              area: Math.floor(Math.random() * 20000) + 5000,
              elements: ['Walls', 'Floors', 'Columns', 'Windows', 'Doors', 'MEP'],
            }
          }
        : f
    ));
  };

  const addFiles = async (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      type: detectFileType(file.name),
      size: file.size,
      progress: 0,
      stage: 'uploading' as ProcessingStage,
      stageMessage: stageMessages.uploading,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Process each file sequentially
    for (const file of newFiles) {
      await processFile(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const allComplete = files.length > 0 && files.every(f => f.stage === 'complete');
  const totalUnits = files.reduce((a, f) => a + (f.result?.units || 0), 0);
  const totalFloors = files.reduce((a, f) => a + (f.result?.floors || 0), 0);
  const totalArea = files.reduce((a, f) => a + (f.result?.area ?? 0), 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Upload className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Upload & Process</h2>
            <p className="text-xs text-gray-400">Drag plans, CAD, or BIM files to auto-generate 3D</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-6 ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
            accept=".pdf,.dwg,.dxf,.rvt,.ifc,.skp,.stp,.step,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
          />
          <motion.div
            animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
            className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4"
          >
            <Upload className="w-8 h-8 text-blue-400" />
          </motion.div>
          <h3 className="text-white font-medium mb-1">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </h3>
          <p className="text-gray-500 text-sm mb-3">or click to browse</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {(['pdf', 'cad', 'bim', 'excel', 'image'] as FileType[]).map(type => {
              const cfg = fileTypeConfig[type];
              const Icon = cfg.icon;
              return (
                <Badge key={type} variant="outline" className="border-gray-700 text-gray-400 text-xs">
                  <Icon className="w-3 h-3 mr-1" style={{ color: cfg.color }} />
                  {cfg.label}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 mb-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium text-sm">Processing Queue ({files.length})</h3>
                {allComplete && (
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    All Complete
                  </Badge>
                )}
              </div>

              {files.map(file => {
                const cfg = fileTypeConfig[file.type];
                const Icon = cfg.icon;
                const isComplete = file.stage === 'complete';
                const isError = file.stage === 'error';
                const isProcessing = !isComplete && !isError;

                return (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`glass-panel rounded-xl p-4 border ${
                      isComplete ? 'border-green-500/20' : isError ? 'border-red-500/20' : 'border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* File Icon */}
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.color + '20' }}>
                        <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white text-sm font-medium truncate">{file.name}</span>
                          <Badge variant="outline" className="border-gray-700 text-gray-500 text-[10px] flex-shrink-0">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {isProcessing && <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />}
                          {isComplete && <CheckCircle className="w-3 h-3 text-green-400" />}
                          {isError && <AlertTriangle className="w-3 h-3 text-red-400" />}
                          <span className={`text-xs ${isComplete ? 'text-green-400' : isError ? 'text-red-400' : 'text-gray-400'}`}>
                            {file.stageMessage}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2 w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              isComplete ? 'bg-green-500' : isError ? 'bg-red-500' : 'bg-blue-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {isComplete && file.result && (
                          <div className="text-right mr-2">
                            <div className="text-xs text-gray-400">{file.result.floors} floors • {file.result.units} units</div>
                            <div className="text-xs text-gray-500">{file.result?.area?.toLocaleString()} m²</div>
                          </div>
                        )}
                        <button onClick={() => removeFile(file.id)} className="p-1.5 text-gray-600 hover:text-red-400 rounded-lg hover:bg-gray-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Extracted Elements */}
                    <AnimatePresence>
                      {isComplete && file.result?.elements && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-3 pt-3 border-t border-gray-700/50"
                        >
                          <div className="text-xs text-gray-500 mb-2">Detected Elements:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {file.result.elements.map((el, i) => (
                              <Badge key={i} className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                                {el}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Summary */}
        <AnimatePresence>
          {allComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-xl p-5 bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-500/20 mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-green-400" />
                <h3 className="text-white font-semibold">AI Processing Complete</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totalFloors}</div>
                  <div className="text-xs text-gray-400">Floors Detected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totalUnits}</div>
                  <div className="text-xs text-gray-400">Units Identified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totalArea.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Total Area (m²)</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white" onClick={onComplete}>
                  <Eye className="w-4 h-4 mr-2" />
                  View in 3D
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Supported Formats Info */}
        <div className="glass-panel rounded-xl p-5">
          <h3 className="text-white font-medium text-sm mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Supported File Formats
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { type: 'PDF', desc: 'Floor plans, elevations, sections', icon: FileText, color: 'text-red-400' },
              { type: 'DWG / DXF', desc: 'AutoCAD drawings with layers', icon: FileCode2, color: 'text-amber-400' },
              { type: 'RVT / IFC', desc: 'Revit & BIM models', icon: Box, color: 'text-green-400' },
              { type: 'SKP', desc: 'SketchUp 3D models', icon: Layers, color: 'text-blue-400' },
              { type: 'STEP / STL', desc: 'Manufacturing CAD files', icon: Box, color: 'text-purple-400' },
              { type: 'XLSX / CSV', desc: 'Pricing & BOQ spreadsheets', icon: FileSpreadsheet, color: 'text-emerald-400' },
            ].map((format, i) => {
              const Icon = format.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30">
                  <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${format.color}`} />
                  <div>
                    <div className="text-sm text-white font-medium">{format.type}</div>
                    <div className="text-xs text-gray-500">{format.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
