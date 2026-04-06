import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CaseList from "./pages/CaseList";
import { Scale } from "lucide-react";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-md text-white">
              <Scale size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Legixo <span className="text-blue-600">Thinklabs</span>
            </span>
          </div>
          <div className="flex space-x-8">
            <Link
              to="/"
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/cases"
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              Cases
            </Link>
          </div>
        </nav>

        <main className="py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cases" element={<CaseList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
