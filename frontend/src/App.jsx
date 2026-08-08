import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ApplicationProvider } from "./context/ApplicationContext";
import ApplicationForm from "./pages/ApplicationForm";
import ConsentManager from "./pages/ConsentManager";
import Processing from "./pages/Processing";
import ResultsDashboard from "./pages/ResultsDashboard";
import ComplianceCenter from "./pages/ComplianceCenter";
import WithdrawalRequestDetail from "./pages/WithdrawalRequestDetail";
import FairnessReports from "./pages/FairnessReports";
import AdminAnalysisDetail from "./pages/AdminAnalysisDetail";
import UsersPage from "./pages/UsersPage";
import ChatAssistant from "./components/assistant/ChatAssistant";

export default function App() {
  return (
    <ApplicationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/application" replace />} />
          <Route path="/application" element={<ApplicationForm />} />
          <Route path="/consent" element={<ConsentManager />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/results" element={<ResultsDashboard />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/compliance" element={<ComplianceCenter />} />
          <Route
            path="/compliance/withdrawal/:id"
            element={<WithdrawalRequestDetail />}
          />
          <Route path="/reporting" element={<FairnessReports />} />
          <Route
            path="/reporting/applications/:id"
            element={<AdminAnalysisDetail />}
          />
        </Routes>
        <ChatAssistant />
      </BrowserRouter>
    </ApplicationProvider>
  );
}
