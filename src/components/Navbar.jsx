import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Download,
  ArrowUpRight,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";

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
  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();

  /* =========================
     FIREBASE AUTH
  ========================== */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /* =========================
     LOGOUT
  ========================== */
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await signOut(auth);

      closeMenu();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Unable to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
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
            DESKTOP AUTH / DASHBOARD
        ========================== */}
        <div className="navbar-actions">

          {user ? (
            <>
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className="nav-download"
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>

              {/* Logout */}
              <button
                type="button"
                className="nav-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <LogOut size={16} />

                <span>
                  {loggingOut
                    ? "Logging out..."
                    : "Logout"}
                </span>
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="nav-login"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>

              {/* Create Account */}
              <Link
                to="/signup"
                className="nav-download"
              >
                <UserPlus size={16} />
                <span>Create Account</span>
              </Link>
            </>
          )}

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
                MOBILE AUTH
            ========================== */}

            {user ? (
              <>
                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="mobile-download"
                >
                  <LayoutDashboard size={17} />
                  <span>Dashboard</span>
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="mobile-logout"
                >
                  <LogOut size={17} />

                  <span>
                    {loggingOut
                      ? "Logging out..."
                      : "Logout"}
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="mobile-nav-link"
                >
                  <span>Login</span>
                  <LogIn size={17} />
                </Link>

                {/* Signup */}
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="mobile-download"
                >
                  <UserPlus size={17} />
                  <span>Create Account</span>
                </Link>
              </>
            )}

            {/* Get App */}
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