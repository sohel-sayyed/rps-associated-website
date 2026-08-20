import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

// =========================================================
// FIREBASE
// =========================================================

import { auth, db } from "./config/firebase";

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
// AUTHENTICATION
// =========================================================

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// =========================================================
// CUSTOMER PAGES
// =========================================================

import CustomerDashboard from "./pages/CustomerDashboard";
import BookService from "./pages/BookService";
import PickupDelivery from "./pages/PickupDelivery";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

// =========================================================
// ADMIN
// =========================================================

import Dashboard from "./pages/Dashboard";
import AdminOrders from "./pages/AdminOrders";

// =========================================================
// 404
// =========================================================

import NotFound from "./pages/NotFound";


// =========================================================
// LOADING SCREEN
// =========================================================

function RouteLoading() {
  return (
    <main className="dashboard-page">

      <div className="dashboard-loading">

        <div className="dashboard-loader"></div>

        <p>
          Checking your account...
        </p>

      </div>

    </main>
  );
}


// =========================================================
// ADMIN PROTECTED ROUTE
// =========================================================

function AdminRoute() {

  const [status, setStatus] = useState("checking");

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {

          if (!currentUser) {
            setStatus("unauthenticated");
            return;
          }

          try {

            const userRef = doc(
              db,
              "users",
              currentUser.uid
            );

            const userSnapshot =
              await getDoc(userRef);

            if (!userSnapshot.exists()) {

              await signOut(auth);

              setStatus("unauthorized");

              return;
            }

            const userData =
              userSnapshot.data();

            if (
              userData.role !== "admin"
            ) {

              setStatus("unauthorized");

              return;
            }

            setStatus("authorized");

          } catch (error) {

            console.error(
              "Admin authorization error:",
              error
            );

            setStatus("unauthorized");
          }
        }
      );

    return () => unsubscribe();

  }, []);


  // =======================================================
  // CHECKING
  // =======================================================

  if (status === "checking") {
    return <RouteLoading />;
  }


  // =======================================================
  // NOT LOGGED IN
  // =======================================================

  if (status === "unauthenticated") {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // =======================================================
  // NOT ADMIN
  // =======================================================

  if (status === "unauthorized") {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  // =======================================================
  // ADMIN
  // =======================================================

  return <Dashboard />;
}


// =========================================================
// CUSTOMER PROTECTED ROUTE
// =========================================================

function CustomerRoute({ children }) {

  const [status, setStatus] = useState("checking");

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {

          if (!currentUser) {
            setStatus("unauthenticated");
            return;
          }

          try {

            const userRef = doc(
              db,
              "users",
              currentUser.uid
            );

            const userSnapshot =
              await getDoc(userRef);

            if (!userSnapshot.exists()) {

              await signOut(auth);

              setStatus("unauthorized");

              return;
            }

            const userData =
              userSnapshot.data();

            if (
              userData.role !== "customer"
            ) {

              setStatus("admin");

              return;
            }

            setStatus("authorized");

          } catch (error) {

            console.error(
              "Customer authorization error:",
              error
            );

            setStatus("unauthorized");
          }
        }
      );

    return () => unsubscribe();

  }, []);


  // =======================================================
  // CHECKING
  // =======================================================

  if (status === "checking") {
    return <RouteLoading />;
  }


  // =======================================================
  // NOT LOGGED IN
  // =======================================================

  if (status === "unauthenticated") {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // =======================================================
  // ADMIN TRYING CUSTOMER PAGE
  // =======================================================

  if (status === "admin") {

    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }


  // =======================================================
  // UNAUTHORIZED
  // =======================================================

  if (status === "unauthorized") {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return children;
}


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
            AUTHENTICATION
        ================================================= */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />


        {/* =================================================
            CUSTOMER DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <CustomerRoute>
              <CustomerDashboard />
            </CustomerRoute>
          }
        />


        {/* =================================================
            BOOK SERVICE
        ================================================= */}

        <Route
          path="/book-service"
          element={
            <CustomerRoute>
              <BookService />
            </CustomerRoute>
          }
        />


        {/* =================================================
            PICKUP + DELIVERY
        ================================================= */}

        <Route
          path="/pickup-delivery"
          element={
            <CustomerRoute>
              <PickupDelivery />
            </CustomerRoute>
          }
        />


        {/* =================================================
            MY ORDERS
        ================================================= */}

        <Route
          path="/orders"
          element={
            <CustomerRoute>
              <Orders />
            </CustomerRoute>
          }
        />


        {/* =================================================
            ORDER DETAILS
        ================================================= */}

        <Route
          path="/order/:orderId"
          element={
            <CustomerRoute>
              <OrderDetails />
            </CustomerRoute>
          }
        />


        {/* =================================================
            ADMIN DASHBOARD
        ================================================= */}

        <Route
          path="/admin"
          element={<AdminRoute />}
        />

<Route
  path="/admin/orders"
  element={<AdminOrders />}
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