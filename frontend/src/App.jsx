import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import LNavbar from "./components/LogedInNavbar.jsx";
import Footer from "./components/Footer";
import Hero from "./components/Hero/Hero.jsx";
import Services from "./components/sections/Services.jsx";
import Hero1 from "./components/Hero/Hero1.jsx";
import About from "./components/sections/AboutUs.jsx";
import StockDetails from "./pages/StockDetails.jsx";
import Error from "./pages/404NotFound.jsx";
import DashboardL from "./components/LoggedInComponents/Dashboard.jsx";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"), // Initial check
  );
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      setUser(storedUser);
    };

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <Router>
      {isAuthenticated ? <LNavbar user={user} /> : <Navbar />}

      <main className="overflow-x-hidden bg-white text-dark">
        <Routes>
          {isAuthenticated ? (
            <Route path="/" element={<DashboardL />} />
          ) : (
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Services />
                  <Hero1 />
                  <About />
                </>
              }
            />
          )}
          <Route path="/stock/:id" element={<StockDetails />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
