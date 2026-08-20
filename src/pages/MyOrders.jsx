import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  Package,
  ArrowRight,
  Clock3,
  CheckCircle2,
  MapPin,
  Shirt,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

import { auth, db } from "../config/firebase";

import "./MyOrders.css";

export default function MyOrders() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // =========================================================
  // LOAD ORDERS
  // =========================================================

  const loadOrders = async (currentUser, showRefresh = false) => {
    if (!currentUser) {
      return;
    }

    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMessage("");

      const ordersQuery = query(
        collection(db, "orders"),
        where("uid", "==", currentUser.uid)
      );

      const snapshot = await getDocs(ordersQuery);

      const orderData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Latest orders first
      orderData.sort((a, b) => {
        const dateA =
          a.createdAt?.toDate?.() || new Date(0);

        const dateB =
          b.createdAt?.toDate?.() || new Date(0);

        return dateB.getTime() - dateA.getTime();
      });

      setOrders(orderData);

    } catch (error) {
      console.error(
        "Error loading orders:",
        error
      );

      setErrorMessage(
        "Unable to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  // =========================================================
  // AUTH
  // =========================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          navigate("/login");
          return;
        }

        setUser(currentUser);

        await loadOrders(currentUser);
      }
    );

    return () => unsubscribe();
  }, [navigate]);


  // =========================================================
  // STATUS HELPERS
  // =========================================================

  const getStatusClass = (status) => {
    const value = status?.toLowerCase() || "processing";

    if (
      value.includes("complete") ||
      value.includes("deliver")
    ) {
      return "order-status-completed";
    }

    if (
      value.includes("ready") ||
      value.includes("pickup")
    ) {
      return "order-status-ready";
    }

    if (
      value.includes("cancel")
    ) {
      return "order-status-cancelled";
    }

    return "order-status-processing";
  };


  const getStatusIcon = (status) => {
    const value = status?.toLowerCase() || "processing";

    if (
      value.includes("complete") ||
      value.includes("deliver")
    ) {
      return CheckCircle2;
    }

    if (
      value.includes("ready") ||
      value.includes("pickup")
    ) {
      return Package;
    }

    return Clock3;
  };


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date unavailable";
    }

    try {
      const date =
        dateValue.toDate?.() ||
        new Date(dateValue);

      return date.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Date unavailable";
    }
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="dashboard-page">

        <div className="dashboard-loading">

          <div className="dashboard-loader"></div>

          <p>
            Loading your orders...
          </p>

        </div>

      </main>
    );
  }


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="dashboard-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="dashboard-hero">

        <div className="dashboard-hero-content">

          <div className="dashboard-label">
            <ShoppingBag size={15} />

            <span>
              MY ORDERS
            </span>
          </div>


          <h1>
            Your
            <br />
            <span>orders.</span>
          </h1>


          <p>
            View your RPS Associated clothing care
            orders and track their current status.
          </p>

        </div>

      </section>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="dashboard-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="orders-page-header">

          <div>
            <span>
              ORDER HISTORY
            </span>

            <h2>
              All Orders
            </h2>
          </div>


          <button
            type="button"
            className="orders-refresh-button"
            onClick={() =>
              loadOrders(user, true)
            }
            disabled={refreshing}
          >

            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "orders-refresh-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {errorMessage && (
          <div className="orders-message orders-error">
            <p>
              {errorMessage}
            </p>
          </div>
        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {orders.length === 0 && !errorMessage ? (

          <div className="dashboard-empty">

            <div className="dashboard-empty-icon">
              <Package size={30} />
            </div>


            <h3>
              No orders yet
            </h3>


            <p>
              You haven't placed any RPS Associated
              service orders yet.
            </p>


            <button
              className="dashboard-primary-button"
              onClick={() =>
                navigate("/services")
              }
            >

              Book Your First Service

              <ArrowRight size={17} />

            </button>

          </div>

        ) : (

          /* =================================================
             ORDER LIST
          ================================================= */

          <div className="orders-list">

            {orders.map((order) => {

              const StatusIcon =
                getStatusIcon(order.status);

              const statusClass =
                getStatusClass(order.status);

              const trackingActive =
                order.tracking?.enabled === true;

              return (
                <article
                  className="order-card"
                  key={order.id}
                >

                  {/* ========================================
                      TOP
                  ======================================== */}

                  <div className="order-card-top">

                    <div className="order-main-icon">
                      <Package size={23} />
                    </div>


                    <div className="order-heading">

                      <span>
                        ORDER #
                        {order.id
                          .slice(0, 8)
                          .toUpperCase()}
                      </span>

                      <h3>
                        {order.service ||
                          "Professional Ironing"}
                      </h3>

                    </div>


                    <div
                      className={`order-status ${statusClass}`}
                    >

                      <StatusIcon size={15} />

                      <span>
                        {order.status ||
                          "Processing"}
                      </span>

                    </div>

                  </div>


                  {/* ========================================
                      DETAILS
                  ======================================== */}

                  <div className="order-details-grid">

                    {/* Items */}

                    <div className="order-detail">

                      <Shirt size={17} />

                      <div>

                        <span>
                          Clothes
                        </span>

                        <strong>
                          {order.items || 0}{" "}
                          {order.items === 1
                            ? "Item"
                            : "Items"}
                        </strong>

                      </div>

                    </div>


                    {/* Pickup */}

                    <div className="order-detail">

                      <MapPin size={17} />

                      <div>

                        <span>
                          Pickup Date
                        </span>

                        <strong>
                          {order.pickupDate
                            ? formatDate(
                                order.pickupDate
                              )
                            : "Not scheduled"}
                        </strong>

                      </div>

                    </div>


                    {/* Created */}

                    <div className="order-detail">

                      <Clock3 size={17} />

                      <div>

                        <span>
                          Ordered On
                        </span>

                        <strong>
                          {formatDate(
                            order.createdAt
                          )}
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* ========================================
                      TRACKING
                  ======================================== */}

                  {trackingActive && (
                    <div className="order-tracking-active">

                      <div>
                        <span className="tracking-dot"></span>

                        <span>
                          Live tracking available
                        </span>
                      </div>

                      <span>
                        Agent is currently sharing
                        location
                      </span>

                    </div>
                  )}


                  {/* ========================================
                      FOOTER
                  ======================================== */}

                  <div className="order-card-footer">

                    <span>
                      RPS Associated
                    </span>


                    <button
                      type="button"
                      className="order-view-button"
                      onClick={() =>
                        navigate(
                          `/orders/${order.id}`
                        )
                      }
                    >

                      View Order

                      <ArrowRight size={17} />

                    </button>

                  </div>

                </article>
              );
            })}

          </div>

        )}

      </section>

    </main>
  );
}