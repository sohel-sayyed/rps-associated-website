import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Download,
  ArrowUpRight,
} from "lucide-react";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Our App", to: "/app" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="navbar">

        {/* =========================
            LOGO
        ========================== */}
        <Link
          to="/"
          className="brand"
          onClick={closeMenu}
          aria-label="RPS Associated Home"
        >
          <img
            src="/assets/rps-logo.png"
            alt="RPS Associated"
            className="brand-logo"
          />
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* =========================
            DESKTOP CTA
        ========================== */}
        <div className="navbar-actions">
          <Link
            to="/app"
            className="nav-download"
          >
            <Download size={16} />
            <span>Get the App</span>
          </Link>
        </div>

        {/* =========================
            MOBILE MENU BUTTON
        ========================== */}
        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={
            menuOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X size={23} />
          ) : (
            <Menu size={23} />
          )}
        </button>
      </div>

      {/* =========================
          MOBILE NAVIGATION
      ========================== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav"
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.25,
            }}
          >

            {/* Main Navigation */}
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === "/"}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `mobile-nav-link ${
                    isActive
                      ? "mobile-active"
                      : ""
                  }`
                }
              >
                <span>{item.label}</span>
                <ArrowUpRight size={17} />
              </NavLink>
            ))}

            {/* =========================
                MOBILE APP CTA
            ========================== */}
            <Link
              to="/app"
              onClick={closeMenu}
              className="mobile-download"
            >
              <Download size={17} />
              <span>Get the App</span>
            </Link>

          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}