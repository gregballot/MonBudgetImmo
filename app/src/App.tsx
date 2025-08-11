import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import About from "./views/About/About";
import Simulator from "./views/Simulator/Simulator";
import BlogList from "./views/Blog/BlogList";
import BlogPost from "./views/Blog/BlogPost";
import NotFound from "./views/NotFound/NotFound";
import Layout from "./components/Layout/Layout";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <Router>
          <Routes>
                          <Route path="/" element={<Layout />}>
                <Route index element={<Simulator />} />
                                <Route path="a-propos" element={<About />} />
                <Route path="simulateur" element={<Navigate to="/" replace />} />
                <Route path="blog" element={<BlogList />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
