import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  LogIn,
} from "lucide-react";

import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../config/firebase";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // =====================================================
      // FIREBASE AUTHENTICATION
      // =====================================================

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password
        );

      const loggedInUser = userCredential.user;

      // =====================================================
      // GET USER PROFILE FROM FIRESTORE
      // =====================================================

      const userDocRef = doc(
        db,
        "users",
        loggedInUser.uid
      );

      const userDoc = await getDoc(userDocRef);

      // =====================================================
      // PROFILE NOT FOUND
      // =====================================================

      if (!userDoc.exists()) {
        await signOut(auth);

        setErrorMessage(
          "Your account profile was not found. Please contact RPS Associated."
        );

        return;
      }

      const userData = userDoc.data();

      const role = userData.role;

      // =====================================================
      // ADMIN LOGIN
      // =====================================================

      if (role === "admin") {
        setSuccessMessage(
          "Admin login successful. Opening Admin Dashboard..."
        );

        setTimeout(() => {
          navigate("/admin", {
            replace: true,
          });
        }, 500);

        return;
      }

      // =====================================================
      // DELIVERY PARTNER LOGIN
      // =====================================================

      if (role === "delivery_partner") {
        // Check if delivery partner account is active

        if (userData.isActive !== true) {
          await signOut(auth);

          setErrorMessage(
            "Your delivery partner account is currently inactive. Please contact RPS Associated."
          );

          return;
        }

        setSuccessMessage(
          "Delivery Partner login successful. Opening Dashboard..."
        );

        setTimeout(() => {
          navigate("/delivery", {
            replace: true,
          });
        }, 500);

        return;
      }

      // =====================================================
      // CUSTOMER LOGIN
      // =====================================================

      if (role === "customer") {
        setSuccessMessage(
          "Login successful! Welcome back."
        );

        setTimeout(() => {
          navigate("/dashboard", {
            replace: true,
          });
        }, 500);

        return;
      }

      // =====================================================
      // UNKNOWN ROLE
      // =====================================================

      await signOut(auth);

      setErrorMessage(
        "Your account role is not configured correctly. Please contact RPS Associated."
      );

    } catch (error) {
      console.error("Login error:", error);

      switch (error.code) {
        case "auth/invalid-credential":
          setErrorMessage(
            "Invalid email or password."
          );
          break;

        case "auth/user-not-found":
          setErrorMessage(
            "No account found with this email."
          );
          break;

        case "auth/wrong-password":
          setErrorMessage(
            "Incorrect password."
          );
          break;

        case "auth/invalid-email":
          setErrorMessage(
            "Please enter a valid email address."
          );
          break;

        case "auth/too-many-requests":
          setErrorMessage(
            "Too many login attempts. Please try again later."
          );
          break;

        case "auth/network-request-failed":
          setErrorMessage(
            "Network error. Please check your internet connection."
          );
          break;

        case "permission-denied":
          setErrorMessage(
            "You do not have permission to access this account."
          );
          break;

        default:
          setErrorMessage(
            "Unable to login. Please try again."
          );
      }

    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <section className="contact-section">

      <div className="contact-container">

        {/* ===================================================
            LOGIN HEADING
        =================================================== */}

        <motion.div
          className="contact-heading"
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >

          <div className="section-label">

            <LogIn size={15} />

            <span>
              RPS LOGIN
            </span>

          </div>

          <h2>
            Welcome
            <br />
            <span>
              back.
            </span>
          </h2>

          <p>
            Login to your RPS Associated account
            to manage your services and orders.
          </p>

        </motion.div>


        {/* ===================================================
            LOGIN FORM
        =================================================== */}

        <motion.div
          className="contact-form-wrapper"
          style={{
            maxWidth: "520px",
            margin: "0 auto",
          }}
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >

          <div className="contact-form-header">

            <h3>
              Login
            </h3>

            <p>
              Enter your registered email and password.
            </p>

          </div>


          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="contact-field">

              <label htmlFor="login-email">
                Email
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >

                <Mail
                  size={18}
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                  }}
                />

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  required
                  autoComplete="email"
                  style={{
                    paddingLeft: "45px",
                  }}
                />

              </div>

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="contact-field">

              <label htmlFor="login-password">
                Password
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >

                <Lock
                  size={18}
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                  }}
                />

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                  style={{
                    paddingLeft: "45px",
                    paddingRight: "45px",
                  }}
                />

                {/* =================================================
                    SHOW / HIDE PASSWORD
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    background:
                      "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >

                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}

                </button>

              </div>

            </div>


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {successMessage && (
              <p className="contact-success">
                {successMessage}
              </p>
            )}


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {errorMessage && (
              <p className="contact-error">
                {errorMessage}
              </p>
            )}


            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              className="contact-submit"
              disabled={isLoading}
            >

              {isLoading
                ? "Logging in..."
                : "Login"}

              {!isLoading && (
                <ArrowRight size={18} />
              )}

            </button>

          </form>

        </motion.div>

      </div>

    </section>
  );
}