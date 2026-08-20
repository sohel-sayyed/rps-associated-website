import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
} from "lucide-react";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../config/firebase";

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    setErrorMessage("");
    setSuccessMessage("");
  };

  // =========================================================
  // CREATE CUSTOMER ACCOUNT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    // -------------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------------

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage(
        "Password must contain at least 6 characters."
      );
      return;
    }

    setIsLoading(true);

    try {
      // =====================================================
      // 1. CREATE FIREBASE AUTH ACCOUNT
      // =====================================================

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password
        );

      const user = userCredential.user;

      console.log("Firebase Auth account created:", user.uid);

      // =====================================================
      // 2. UPDATE AUTH PROFILE
      // =====================================================

      try {
        await updateProfile(user, {
          displayName: formData.name.trim(),
        });

        console.log("Firebase Auth profile updated.");
      } catch (profileError) {
        console.error(
          "Profile update error:",
          profileError
        );

        // Profile update failure should not stop account creation.
      }

      // =====================================================
      // 3. CREATE USERS DOCUMENT
      // =====================================================

      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            uid: user.uid,
            name: formData.name.trim(),
            email: formData.email.trim(),
            role: "customer",
            createdAt: serverTimestamp(),
          }
        );

        console.log(
          "users document created successfully."
        );
      } catch (firestoreError) {
        console.error(
          "USERS Firestore error:",
          firestoreError
        );

        throw new Error(
          `Firestore users error: ${
            firestoreError.code || "unknown-error"
          }`
        );
      }

      // =====================================================
      // 4. CREATE CUSTOMER DOCUMENT
      // =====================================================

      try {
        await setDoc(
          doc(db, "customers", user.uid),
          {
            uid: user.uid,
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: "",
            role: "customer",
            createdAt: serverTimestamp(),
          }
        );

        console.log(
          "customers document created successfully."
        );
      } catch (firestoreError) {
        console.error(
          "CUSTOMERS Firestore error:",
          firestoreError
        );

        throw new Error(
          `Firestore customers error: ${
            firestoreError.code || "unknown-error"
          }`
        );
      }

      // =====================================================
      // 5. SUCCESS
      // =====================================================

      setSuccessMessage(
        "Account created successfully! Welcome to RPS Associated."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // =====================================================
      // 6. GO TO CUSTOMER DASHBOARD
      // =====================================================

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);

    } catch (error) {
      console.error(
        "================================================="
      );

      console.error(
        "CUSTOMER SIGNUP ERROR"
      );

      console.error(
        "Error code:",
        error.code
      );

      console.error(
        "Error message:",
        error.message
      );

      console.error(
        "Full error:",
        error
      );

      console.error(
        "================================================="
      );

      // =====================================================
      // FIREBASE AUTH ERRORS
      // =====================================================

      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMessage(
            "An account already exists with this email."
          );
          break;

        case "auth/invalid-email":
          setErrorMessage(
            "Please enter a valid email address."
          );
          break;

        case "auth/weak-password":
          setErrorMessage(
            "Password is too weak. Use a stronger password."
          );
          break;

        case "auth/network-request-failed":
          setErrorMessage(
            "Network error. Please check your internet connection."
          );
          break;

        case "auth/operation-not-allowed":
          setErrorMessage(
            "Email/password authentication is not enabled in Firebase."
          );
          break;

        case "auth/too-many-requests":
          setErrorMessage(
            "Too many attempts. Please wait a little and try again."
          );
          break;

        // ===================================================
        // FIRESTORE ERRORS
        // ===================================================

        case "permission-denied":
          setErrorMessage(
            "Firestore permission denied. Please check Firebase Firestore security rules."
          );
          break;

        case "failed-precondition":
          setErrorMessage(
            "Firestore is not configured correctly yet."
          );
          break;

        case "unavailable":
          setErrorMessage(
            "Firebase is temporarily unavailable. Please try again."
          );
          break;

        default:
          setErrorMessage(
            `Signup failed: ${
              error.code || "unknown-error"
            }`
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
            HEADING
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
            <UserPlus size={15} />

            <span>
              JOIN RPS
            </span>
          </div>

          <h2>
            Create your
            <br />

            <span>
              account.
            </span>
          </h2>

          <p>
            Create your RPS Associated
            customer account and manage
            your services easily.
          </p>
        </motion.div>

        {/* ===================================================
            FORM
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
              Create Account
            </h3>

            <p>
              Enter your details to get started.
            </p>
          </div>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            {/* =================================================
                NAME
            ================================================= */}

            <div className="contact-field">
              <label htmlFor="signup-name">
                Full Name
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <User
                  size={18}
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />

                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  style={{
                    paddingLeft: "45px",
                  }}
                />
              </div>
            </div>

            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="contact-field">
              <label htmlFor="signup-email">
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
                    pointerEvents: "none",
                  }}
                />

                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  required
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
              <label htmlFor="signup-password">
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
                    pointerEvents: "none",
                  }}
                />

                <input
                  id="signup-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  style={{
                    paddingLeft: "45px",
                    paddingRight: "45px",
                  }}
                />

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
                CONFIRM PASSWORD
            ================================================= */}

            <div className="contact-field">
              <label htmlFor="signup-confirm-password">
                Confirm Password
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
                    pointerEvents: "none",
                  }}
                />

                <input
                  id="signup-confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  style={{
                    paddingLeft: "45px",
                    paddingRight: "45px",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showConfirmPassword
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
                  {showConfirmPassword ? (
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
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              className="contact-submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Creating Account..."
                : "Create Account"}

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