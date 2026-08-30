import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// =========================================================
// GLOBAL NAVIGATION + FOOTER
// =========================================================

import Navbar from "./components/Navbar";
import Footer from "./sections/Footer";

// =========================================================
// MAIN WEBSITE PAGES
// =========================================================

import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ServicesPage from "./pages/ServicesPage";
import OurAppPage from "./pages/OurAppPage";

// =========================================================
// LEGAL PAGES
// =========================================================

import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";

// =========================================================
// 404
// =========================================================

import NotFound from "./pages/NotFound";


// =========================================================
// APP
// =========================================================

export default function App() {
  return (
    <BrowserRouter>

      {/* ===================================================
          GLOBAL NAVBAR
      =================================================== */}

      <Navbar />


      {/* ===================================================
          ROUTES
      =================================================== */}

      <Routes>

        {/* =================================================
            MAIN WEBSITE
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/contact"
          element={<ContactPage />}
        />

        <Route
          path="/how-it-works"
          element={<HowItWorksPage />}
        />

        <Route
          path="/services"
          element={<ServicesPage />}
        />

        <Route
          path="/our-app"
          element={<OurAppPage />}
        />

        <Route
          path="/app"
          element={<OurAppPage />}
        />


        {/* =================================================
            LEGAL
        ================================================= */}

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicyPage />}
        />

        <Route
          path="/terms"
          element={<TermsPage />}
        />


        {/* =================================================
            404
        ================================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>


      {/* ===================================================
          GLOBAL FOOTER
      =================================================== */}

      <Footer />

    </BrowserRouter>
  );
}