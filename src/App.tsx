import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AgentConsole from './pages/AgentConsole';
import AdminProjects from './pages/AdminProjects';
import AdminUnits from './pages/AdminUnits';
import AdminLeads from './pages/AdminLeads';
import AdminBuyers from './pages/AdminBuyers';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminWorkflows from './pages/AdminWorkflows';
import AdminSettings from './pages/AdminSettings';
import DemandEngine from './pages/DemandEngine';
import CampaignBuilder from './pages/CampaignBuilder';
import AdEditor from './pages/AdEditor';
import AdminCRM from './pages/AdminCRM';
import AdminTasks from './pages/AdminTasks';
import SEOKewords from './pages/SEOKewords';
import WidgetConfig from './pages/WidgetConfig';
import ProjectWorkspace from './pages/ProjectWorkspace';
import PricingPage from './pages/PricingPage';
import SalesLandingPage from './pages/SalesLandingPage';
import EmbedWidget from './pages/EmbedWidget';
import EmbedWidgetPage from './pages/EmbedWidgetPage';
import IntegrationHub from './pages/IntegrationHub';
import CRMIntegration from './pages/CRMIntegration';
import WhatsAppIntegration from './pages/WhatsAppIntegration';
import PortalSync from './pages/PortalSync';
import DeveloperPortal from './pages/DeveloperPortal';
import AIContentGenerator from './pages/AIContentGenerator';
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import SuperAdmin from "./pages/SuperAdmin"
import NeuralDashboard from "./pages/NeuralDashboard"
import SystemBlueprint from "./pages/SystemBlueprint"
import AdminSettlements from "./pages/AdminSettlements"
import AdminHold from "./pages/AdminHold"
import AdminAlgorithms from "./pages/AdminAlgorithms"
import AdminPhasing from "./pages/AdminPhasing"
import DocumentVault from "./pages/DocumentVault"
import FinancialModelling from "./pages/FinancialModelling"
import FloorPlanViewer from "./pages/FloorPlanViewer"
import DigitalTwin from "./pages/DigitalTwin"
import ThreeViewer from "./pages/ThreeViewer"
import ProjectExperience from "./pages/ProjectExperience"
import DayEngine from "./pages/DayEngine"
import SoundOfHome from "./pages/SoundOfHome"
import TimeScrub from "./pages/TimeScrub"
import StackingPlan from "./pages/StackingPlan"
import ReservationFlow from "./pages/ReservationFlow"
import BuyerPortal from "./pages/BuyerPortal"
import ItRemembers from "./pages/ItRemembers"
import MyLifeHere from "./pages/MyLifeHere"
import WalkTogether from "./pages/WalkTogether"
import LivingProject from "./pages/LivingProject"
import VerifiedViews from "./pages/VerifiedViews"
import KeepsakeStudio from "./pages/KeepsakeStudio"
import './App.css';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/sales" element={<SalesLandingPage />} />
      <Route path="/embed/:projectId" element={<EmbedWidget />} />
      <Route path="/login" element={<Login />} />

      {/* Legacy dashboard (redirects to admin) */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* New Admin Panel — AI Agent Console as default */}
      <Route path="/admin" element={<AgentConsole />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/demand" element={<DemandEngine />} />
      <Route path="/admin/projects" element={<AdminProjects />} />
      <Route path="/admin/units" element={<AdminUnits />} />
      <Route path="/admin/leads" element={<AdminLeads />} />
      <Route path="/admin/buyers" element={<AdminBuyers />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/workflows" element={<AdminWorkflows />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/campaign" element={<CampaignBuilder />} />
      <Route path="/admin/ads" element={<AdEditor />} />
      <Route path="/admin/crm" element={<AdminCRM />} />
      <Route path="/admin/tasks" element={<AdminTasks />} />
      <Route path="/admin/seo" element={<SEOKewords />} />
      <Route path="/admin/widget" element={<WidgetConfig />} />
      <Route path="/admin/settlements" element={<AdminSettlements />} />
      <Route path="/admin/hold" element={<AdminHold />} />
      <Route path="/admin/algorithms" element={<AdminAlgorithms />} />
      <Route path="/admin/phasing" element={<AdminPhasing />} />
      <Route path="/admin/documents" element={<DocumentVault />} />
      <Route path="/admin/financial" element={<FinancialModelling />} />
      <Route path="/admin/floorplans" element={<FloorPlanViewer />} />
      <Route path="/admin/twin" element={<DigitalTwin />} />
      <Route path="/admin/3d" element={<ThreeViewer />} />

      {/* Project workspace */}
      <Route path="/project/:id" element={<ProjectWorkspace />} />

      {/* Integration hub */}
      <Route path="/integrations" element={<IntegrationHub />} />
      <Route path="/integrations/crm" element={<CRMIntegration />} />
      <Route path="/integrations/whatsapp" element={<WhatsAppIntegration />} />
      <Route path="/integrations/portals" element={<PortalSync />} />

      {/* Developer portal */}
      <Route path="/developers" element={<DeveloperPortal />} />

      {/* AI tools */}
      <Route path="/ai-content" element={<AIContentGenerator />} />

      {/* Widget builder */}
      <Route path="/widget-builder" element={<EmbedWidgetPage />} />

      {/* Super Admin */}
      <Route path="/super-admin" element={<SuperAdmin />} />

      {/* System Blueprint */}
      <Route path="/admin/blueprint" element={<SystemBlueprint />} />

      {/* Neural Command Center */}
      <Route path="/admin/neural" element={<NeuralDashboard />} />
      <Route path="/admin/experience" element={<ProjectExperience />} />
      <Route path="/admin/day-engine" element={<DayEngine />} />
      <Route path="/admin/sound" element={<SoundOfHome />} />
      <Route path="/admin/timescrub" element={<TimeScrub />} />
      <Route path="/admin/stacking" element={<StackingPlan />} />
      <Route path="/admin/reserve" element={<ReservationFlow />} />
      <Route path="/admin/portal" element={<BuyerPortal />} />
      <Route path="/admin/remembers" element={<ItRemembers />} />
      <Route path="/admin/mylife" element={<MyLifeHere />} />
      <Route path="/admin/walk" element={<WalkTogether />} />
      <Route path="/admin/living" element={<LivingProject />} />
      <Route path="/admin/verified" element={<VerifiedViews />} />
      <Route path="/admin/keepsake" element={<KeepsakeStudio />} />

      {/* Public Buyer Portal */}
      <Route path="/portal" element={<BuyerPortal />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
