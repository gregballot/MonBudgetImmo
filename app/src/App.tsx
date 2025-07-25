import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import About from "./views/About/About";
import Simulator from "./views/Simulator/Simulator";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/simulateur" replace />} />
          <Route path="a-propos" element={<About />} />
          <Route path="simulateur" element={<Simulator />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
