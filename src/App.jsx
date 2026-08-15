import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import NotFound from "./pages/NotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./sections/Footer";
import Home from "./pages/Home";
import ServicesPage from "./pages/ServicesPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import OurAppPage from "./pages/OurAppPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <Navbar />

        <main>
          <Routes>

  <Route path="/" element={<Home />} />

  <Route
    path="/services"
    element={<ServicesPage />}
  />

  <Route
    path="/how-it-works"
    element={<HowItWorksPage />}
  />

  <Route
    path="/app"
    element={<OurAppPage />}
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
    path="*"
    element={<NotFound />}
  />

  <Route
  path="/privacy-policy"
  element={<PrivacyPolicyPage />}
/>

<Route
  path="/terms"
  element={<TermsPage />}
/>

</Routes>
        </main>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;