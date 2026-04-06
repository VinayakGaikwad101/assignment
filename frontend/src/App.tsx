import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CaseList from "./pages/CaseList";
import CaseForm from "./pages/CaseForm";
import CaseDetails from "./pages/CaseDetails";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cases" element={<CaseList />} />
            <Route path="/cases/new" element={<CaseForm />} />
            <Route path="/cases/:id" element={<CaseDetails />} />
            <Route path="/cases/:id/edit" element={<CaseForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
