import { useState } from "react";
import {
  Menu,
  X,
  Download,
  ArrowRight,
} from "lucide-react";

// =========================================================
// NAVIGATION LINKS
// =========================================================

const navigationLinks = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Services",
    path: "/services",
  },
  {
    label: "How It Works",
    path: "/how-it-works",
  },
  {
    label: "Our App",
    path: "/our-app",
  },
  {
    label: "About",
    path: "/about",
  },
  {
    label: "Contact",
    path: "/contact",
  },
];

// =========================================================
// NAVBAR
// =========================================================

export default function Navbar() {

  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false);


  // =======================================================
  // CURRENT PATH
  // =======================================================

  const currentPath =
    window.location.pathname;


  // =======================================================
  // CHECK ACTIVE PAGE
  // =======================================================

  const isActive = (path) => {

    if (path === "/") {
      return currentPath === "/";
    }

    return currentPath === path;
  };


  // =======================================================
  // MOBILE MENU
  // =======================================================

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };


  return (
    <header className="site-header">

      {/* ===================================================
          NAVBAR
      =================================================== */}

      <div className="navbar">


        {/* =================================================
            BRAND / LOGO
        ================================================= */}

        <a
          href="/"
          className="brand"
          aria-label="RPS Associated Home"
        >

          <img
            src="/assets/rps-logo.png"
            alt="RPS Associated"
            className="brand-logo"
          />

        </a>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav
          className="desktop-nav"
          aria-label="Main navigation"
        >

          {navigationLinks.map((link) => (

            <a
              key={link.path}
              href={link.path}
              className={
                isActive(link.path)
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              {link.label}
            </a>

          ))}


          {/* ===============================================
              GET THE APP
          =============================================== */}

          <a
            href="/app"
            className="nav-download"
          >

            <Download size={16} />

            <span>
              Get the App
            </span>

          </a>

        </nav>


        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setIsMobileMenuOpen(
              (previous) => !previous
            )
          }
          aria-label={
            isMobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMobileMenuOpen}
        >

          {isMobileMenuOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}

        </button>

      </div>


      {/* ===================================================
          MOBILE NAVIGATION
      =================================================== */}

      {isMobileMenuOpen && (

        <nav
          className="mobile-nav"
          aria-label="Mobile navigation"
        >

          {navigationLinks.map((link) => (

            <a
              key={link.path}
              href={link.path}
              className={
                isActive(link.path)
                  ? "mobile-nav-link mobile-active"
                  : "mobile-nav-link"
              }
              onClick={closeMobileMenu}
            >

              <span>
                {link.label}
              </span>

              <ArrowRight size={16} />

            </a>

          ))}


          {/* ===============================================
              MOBILE GET THE APP
          =============================================== */}

          <a
            href="/app"
            className="mobile-download"
            onClick={closeMobileMenu}
          >

            <Download size={17} />

            <span>
              Get the App
            </span>

          </a>

        </nav>

      )}

    </header>
  );
}