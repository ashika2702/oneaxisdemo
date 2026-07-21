# OneAxis Backend API

Complete backend for the OneAxis Project Experience Operating System.

---

## What Your Developers Need To Do (Step by Step)

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+ (optional for dev, required for production)

### Step 1: Install Dependencies
```bash
cd oneaxis-backend
npm install
```

### Step 2: Create Environment File
```bash
cp .env.example .env
# Edit .env with your values
```

Required minimum `.env`:
```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=oneaxis
DB_USER=your_db_user
DB_PASSWORD=your_db_password

JWT_SECRET=change-this-to-a-random-string
OPENAI_API_KEY=sk-your-openai-key
```

### Step 3: Create PostgreSQL Database
```bash
psql -U postgres
CREATE DATABASE oneaxis;
CREATE USER oneaxis_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE oneaxis TO oneaxis_user;
\q
```

### Step 4: Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:4000`

Database tables are auto-created on first run.

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, get JWT token |
| GET | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List user's projects |
| POST | `/api/projects` | Create new project |
| GET | `/api/projects/:id` | Get project + units + files + BOM |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/units` | Add unit to project |
| PUT | `/api/projects/:id/units/:unitId` | Update unit |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/files/upload` | Upload plan/document |
| GET | `/api/files/:projectId` | List project files |
| DELETE | `/api/files/:fileId` | Delete file |

### AI Processing
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/parse-plan` | Parse plan image with GPT-4 Vision |
| POST | `/api/ai/chat` | AI chat with project context |
| POST | `/api/ai/generate-options` | AI Optioneer scenarios |

### Widgets (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/widgets/embed/:projectId` | Get widget data (no auth) |
| POST | `/api/widgets` | Save widget config (auth) |

### Proposals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/proposals/view/:slug` | View public proposal |
| POST | `/api/proposals` | Create proposal (auth) |
| GET | `/api/proposals/:projectId/stats` | Proposal analytics |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

### WebSocket Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `join-project` | Client → Server | Join project room |
| `cursor-move` | Client → Server | Send cursor position |
| `unit-select` | Client → Server | Select unit |
| `edit-made` | Client → Server | Record edit |
| `chat-message` | Client → Server | Send chat message |
| `user-joined` | Server → Client | User joined room |
| `cursor-update` | Server → Client | Cursor position update |
| `edit-synced` | Server → Client | Edit broadcast |
| `chat-received` | Server → Client | Chat message received |

---

## Database Schema

### Tables Auto-Created
- `users` — Accounts and authentication
- `projects` — Project records with location data
- `units` — Individual units (apartments, lots, etc.)
- `files` — Uploaded documents and their AI processing results
- `edit_history` — Audit trail of all changes
- `proposals` — Shareable proposal configurations
- `widget_configs` — Embeddable widget settings
- `bom_items` — Bill of materials line items

---

## Architecture Decisions

### Why Node.js + Express?
- Same language as frontend (TypeScript everywhere)
- Massive ecosystem, easy to hire for
- Socket.io for real-time collaboration
- Easy to deploy anywhere

### Why PostgreSQL?
- JSONB columns for flexible project metadata
- Full ACID compliance for financial data (pricing, BOM)
- Geographic extensions (PostGIS) for location-aware features
- Scales from startup to enterprise

### Why Not MongoDB?
We use JSONB in PostgreSQL for the flexibility Mongo offers, while keeping relational integrity for pricing, user auth, and audit trails. Best of both worlds.

### OpenAI Integration
- GPT-4 Vision for PDF/plan parsing (image to structured data)
- GPT-4o for conversational AI with project context
- Graceful fallback to mock data when API key not configured

---

## Deployment Checklist

### Development
```bash
npm run dev          # Auto-restarts on file changes
```

### Production Build
```bash
npm run build        # Compiles TypeScript to dist/
npm start            # Runs compiled code
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://your-domain.com

# Database
DB_HOST=your-db-host
DB_NAME=oneaxis_prod
DB_USER=oneaxis_prod
DB_PASSWORD=strong-password

# Security
JWT_SECRET=64-char-random-string
BCRYPT_ROUNDS=12

# AI
OPENAI_API_KEY=sk-prod-key

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=oneaxis-uploads-prod

# Redis (for scaling)
REDIS_URL=redis://your-redis-host:6379
```

---

## Integration with Frontend

The frontend expects the API at the same origin in production, or at `http://localhost:4000` in development.

### Update Frontend API URL
In the frontend `.env`:
```env
VITE_API_URL=http://localhost:4000/api
VITE_WS_URL=ws://localhost:4000
```

### Authentication Flow
1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Frontend sends `Authorization: Bearer <token>` header with every request

---

## Geographic Awareness (Phase 2)

The database already stores `location_lat` and `location_lng` for every project. To enable:

1. **Sun path simulation:** Use `suncalc` npm package with lat/lng + date
2. **Wind data:** Integrate OpenWeatherMap API historical weather
3. **Satellite imagery:** Google Maps Static API or Mapbox Satellite
4. **Rain simulation:** Weather API + particle effects in Three.js
5. **Viewshed analysis:** Raycasting from unit positions to surrounding terrain

Enable PostGIS extension for advanced spatial queries:
```sql
CREATE EXTENSION postgis;
```

---

## Scaling Considerations

| Scale | Users | Infrastructure |
|-------|-------|---------------|
| **0-100** | 1-20 | Single Node.js instance + PostgreSQL |
| **100-1K** | 20-200 | PM2 cluster mode + PostgreSQL read replica |
| **1K-10K** | 200-2K | Load balancer + multiple API instances + Redis cluster |
| **10K+** | 2K+ | Kubernetes + managed PostgreSQL + CDN for files |

---

## File Structure
```
oneaxis-backend/
├── src/
│   ├── config/
│   │   └── database.ts       # PostgreSQL connection + schema
│   ├── middleware/
│   │   └── auth.ts           # JWT authentication
│   ├── routes/
│   │   ├── auth.ts           # Login/register endpoints
│   │   ├── projects.ts       # Project CRUD + units
│   │   ├── files.ts          # File upload
│   │   ├── ai.ts             # GPT-4 Vision + chat
│   │   ├── widgets.ts        # Embeddable widget API
│   │   └── proposals.ts      # Proposal share links
│   ├── services/
│   │   ├── aiParser.ts       # OpenAI integration
│   │   └── socketHandler.ts  # WebSocket real-time
│   ├── utils/
│   │   └── logger.ts         # Winston logging
│   └── server.ts             # Entry point
├── uploads/                   # Local file storage (dev)
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## Next Steps After Backend is Running

1. **Connect frontend** — Update API URLs, add JWT handling
2. **Set up file upload** — Configure S3 or keep local for dev
3. **Add OpenAI key** — Enable real AI parsing
4. **Test WebSocket** — Real-time cursors and edit sync
5. **Deploy to staging** — Test with real customer data
6. **Add Stripe** — For payment processing
7. **Set up monitoring** — Winston logs + health checks

---

**Questions? The architecture is designed so any Node.js developer can pick this up and run with it. The code is typed, documented, and follows Express best practices.**
