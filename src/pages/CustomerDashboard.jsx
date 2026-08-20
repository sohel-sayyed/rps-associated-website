import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import {
  User,
  Mail,
  Package,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Shirt,
  LogOut,
  Truck,
  MapPin,
  Phone,
  UserRound,
  Navigation,
  CircleCheck,
} from "lucide-react";

import { auth, db } from "../config/firebase";

import "./CustomerDashboard.css";

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // AUTH + REAL-TIME ORDERS
  // =========================================================

  useEffect(() => {
    let ordersUnsubscribe = null;

    const authUnsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        // ---------------------------------------------------
        // USER NOT LOGGED IN
        // ---------------------------------------------------

        if (!currentUser) {
          setUser(null);
          setOrders([]);
          setLoading(false);

          navigate("/login", {
            replace: true,
          });

          return;
        }

        setUser(currentUser);

        // ---------------------------------------------------
        // REAL-TIME FIRESTORE LISTENER
        // ---------------------------------------------------

        const ordersQuery = query(
          collection(db, "orders"),
          where("uid", "==", currentUser.uid)
        );

        ordersUnsubscribe = onSnapshot(
          ordersQuery,
          (snapshot) => {
            const orderData = snapshot.docs.map(
              (orderDoc) => ({
                id: orderDoc.id,
                ...orderDoc.data(),
              })
            );

            // ------------------------------------------------
            // SORT LATEST ORDER FIRST
            // ------------------------------------------------

            orderData.sort((a, b) => {
              const dateA =
                a.createdAt?.toDate?.() ||
                new Date(0);

              const dateB =
                b.createdAt?.toDate?.() ||
                new Date(0);

              return (
                dateB.getTime() -
                dateA.getTime()
              );
            });

            // ------------------------------------------------
            // LATEST 5 ORDERS
            // ------------------------------------------------

            setOrders(
              orderData.slice(0, 5)
            );

            setLoading(false);
          },
          (error) => {
            console.error(
              "Realtime orders error:",
              error
            );

            setOrders([]);
            setLoading(false);
          }
        );
      }
    );

    // -------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------

    return () => {
      authUnsubscribe();

      if (ordersUnsubscribe) {
        ordersUnsubscribe();
      }
    };
  }, [navigate]);


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="dashboard-page">

        <div className="dashboard-loading">

          <div className="dashboard-loader"></div>

          <p>
            Loading your dashboard...
          </p>

        </div>

      </main>
    );
  }


  // =========================================================
  // NO USER
  // =========================================================

  if (!user) {
    return null;
  }


  // =========================================================
  // CUSTOMER NAME
  // =========================================================

  const displayName =
    user.displayName ||
    user.email?.split("@")[0] ||
    "Customer";


  // =========================================================
  // STATUS NORMALIZER
  // =========================================================

  const normalizeStatus = (status) => {
    return String(
      status || "Processing"
    )
      .trim()
      .toLowerCase()
      .replace(/_/g, " ");
  };


  // =========================================================
  // STATUS INDEX
  // =========================================================

  const getStatusIndex = (status) => {
    const normalized =
      normalizeStatus(status);

    if (
      normalized === "order placed" ||
      normalized === "confirmed" ||
      normalized === "order confirmed"
    ) {
      return 0;
    }

    if (
      normalized === "pickup assigned" ||
      normalized === "assigned"
    ) {
      return 1;
    }

    if (
      normalized === "picked up" ||
      normalized === "pickup complete" ||
      normalized === "picked"
    ) {
      return 2;
    }

    if (
      normalized === "processing" ||
      normalized === "in progress"
    ) {
      return 3;
    }

    if (
      normalized === "ready" ||
      normalized === "ready for delivery"
    ) {
      return 4;
    }

    if (
      normalized === "out for delivery" ||
      normalized === "out_for_delivery"
    ) {
      return 5;
    }

    if (
      normalized === "delivered" ||
      normalized === "completed" ||
      normalized === "complete"
    ) {
      return 6;
    }

    return 3;
  };


  // =========================================================
  // TRACKING STEPS
  // =========================================================

  const trackingSteps = [
    {
      key: "confirmed",
      title: "Order Confirmed",
      description:
        "Your service order has been received.",
    },

    {
      key: "assigned",
      title: "Pickup Assigned",
      description:
        "A delivery partner has been assigned.",
    },

    {
      key: "picked",
      title: "Clothes Picked Up",
      description:
        "Your clothes have been collected.",
    },

    {
      key: "processing",
      title: "Processing",
      description:
        "Your clothes are being handled.",
    },

    {
      key: "ready",
      title: "Ready",
      description:
        "Your clothes are ready for delivery.",
    },

    {
      key: "delivery",
      title: "Out for Delivery",
      description:
        "Your order is on the way.",
    },

    {
      key: "delivered",
      title: "Delivered",
      description:
        "Your order has been successfully delivered.",
    },
  ];


  // =========================================================
  // DELIVERY PARTNER DATA HELPER
  // =========================================================

  const getDeliveryPartner = (order) => {
    return (
      order.deliveryPartner ||
      order.assignedPartner ||
      order.delivery_partner ||
      null
    );
  };


  // =========================================================
  // ORDER TRACKING CARD
  // =========================================================

  const TrackingCard = ({ order }) => {
    const status =
      order.status || "Processing";

    const currentStatusIndex =
      getStatusIndex(status);

    const partner =
      getDeliveryPartner(order);

    const partnerName =
      partner?.name ||
      order.deliveryPartnerName ||
      order.assignedPartnerName ||
      "Delivery Partner";

    const partnerPhone =
      partner?.phone ||
      order.deliveryPartnerPhone ||
      order.assignedPartnerPhone ||
      "";

    const isDelivered =
      normalizeStatus(status) ===
        "delivered" ||
      normalizeStatus(status) ===
        "completed" ||
      normalizeStatus(status) ===
        "complete";

    const isOutForDelivery =
      normalizeStatus(status) ===
      "out for delivery";


    return (
      <div className="customer-tracking-card">

        {/* =================================================
            TRACKING HEADER
            ================================================= */}

        <div className="customer-tracking-header">

          <div>

            <span className="dashboard-small-label">
              LIVE ORDER TRACKING
            </span>

            <h3>
              {order.service ||
                "Clothing Care Service"}
            </h3>

            <p>
              ORDER #
              {order.id
                .slice(0, 8)
                .toUpperCase()}
            </p>

          </div>


          <div className="customer-tracking-status">

            <Truck size={16} />

            <span>
              {order.status ||
                "Processing"}
            </span>

          </div>

        </div>


        {/* =================================================
            PROGRESS BAR
            ================================================= */}

        <div className="customer-tracking-progress">

          <div
            className="customer-tracking-progress-fill"
            style={{
              width: `${
                (currentStatusIndex /
                  (trackingSteps.length - 1)) *
                100
              }%`,
            }}
          />

        </div>


        {/* =================================================
            TIMELINE
            ================================================= */}

        <div className="customer-tracking-timeline">

          {trackingSteps.map(
            (step, index) => {

              const completed =
                index <=
                currentStatusIndex;

              const active =
                index ===
                currentStatusIndex;

              return (
                <div
                  className={`customer-tracking-step ${
                    completed
                      ? "completed"
                      : ""
                  } ${
                    active
                      ? "active"
                      : ""
                  }`}
                  key={step.key}
                >

                  <div className="customer-tracking-step-icon">

                    {completed ? (
                      <CheckCircle2
                        size={17}
                      />
                    ) : (
                      <span>
                        {index + 1}
                      </span>
                    )}

                  </div>


                  <div className="customer-tracking-step-content">

                    <strong>
                      {step.title}
                    </strong>

                    <p>
                      {step.description}
                    </p>

                  </div>

                </div>
              );
            }
          )}

        </div>


        {/* =================================================
            DELIVERY PARTNER
            ================================================= */}

        {(
          isOutForDelivery ||
          isDelivered ||
          partner
        ) && (

          <div className="customer-delivery-partner">

            <div className="customer-delivery-partner-icon">

              <UserRound
                size={21}
              />

            </div>


            <div className="customer-delivery-partner-info">

              <span>
                DELIVERY PARTNER
              </span>

              <strong>
                {partnerName}
              </strong>

              {partnerPhone && (
                <p>
                  <Phone size={14} />

                  {partnerPhone}
                </p>
              )}

            </div>


            {partnerPhone && (
              <a
                href={`tel:${partnerPhone}`}
                className="customer-call-partner"
              >
                <Phone size={17} />

                Call
              </a>
            )}

          </div>

        )}


        {/* =================================================
            LOCATION / DELIVERY MESSAGE
            ================================================= */}

        {isOutForDelivery && (
          <div className="customer-live-location">

            <div className="customer-live-location-icon">

              <Navigation
                size={20}
              />

            </div>


            <div>

              <span>
                YOUR ORDER IS ON THE WAY
              </span>

              <strong>
                Delivery partner is heading
                towards your address.
              </strong>

              <p>
                Live location integration can
                be connected here.
              </p>

            </div>

          </div>
        )}


        {/* =================================================
            DELIVERED MESSAGE
            ================================================= */}

        {isDelivered && (
          <div className="customer-delivered-message">

            <CircleCheck
              size={21}
            />

            <div>

              <strong>
                Order Delivered Successfully
              </strong>

              <p>
                Thank you for choosing
                RPS Associated.
              </p>

            </div>

          </div>
        )}

      </div>
    );
  };


  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <main className="dashboard-page">

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="dashboard-hero">

        <div className="dashboard-hero-content">

          <div className="dashboard-label">

            <CheckCircle2 size={15} />

            <span>
              RPS CUSTOMER DASHBOARD
            </span>

          </div>


          <h1>
            Welcome back,
            <br />

            <span>
              {displayName}.
            </span>
          </h1>


          <p>
            Manage your RPS Associated services,
            orders and clothing care from one place.
          </p>

        </div>

      </section>


      {/* =====================================================
          DASHBOARD CONTENT
          ===================================================== */}

      <section className="dashboard-container">

        {/* ===================================================
            CUSTOMER CARD
            =================================================== */}

        <div className="dashboard-profile-card">

          <div className="dashboard-profile-icon">

            <User size={25} />

          </div>


          <div className="dashboard-profile-info">

            <span className="dashboard-small-label">
              CUSTOMER ACCOUNT
            </span>

            <h2>
              {displayName}
            </h2>

            <div className="dashboard-email">

              <Mail size={15} />

              <span>
                {user.email}
              </span>

            </div>

          </div>


          <div className="dashboard-account-status">

            <CheckCircle2 size={15} />

            <span>
              Active
            </span>

          </div>

        </div>


        {/* ===================================================
            QUICK ACTIONS
            =================================================== */}

        <div className="dashboard-section-heading">

          <div>

            <span>
              QUICK ACTIONS
            </span>

            <h2>
              What would you like to do?
            </h2>

          </div>

        </div>


        <div className="dashboard-actions-grid">

          {/* BOOK SERVICE */}

          <button
            className="dashboard-action-card"
            onClick={() =>
              navigate("/services")
            }
          >

            <div className="dashboard-action-icon">

              <Shirt size={23} />

            </div>


            <div>

              <h3>
                Book a Service
              </h3>

              <p>
                Choose ironing, laundry or clothing care.
              </p>

            </div>


            <ArrowRight size={19} />

          </button>


          {/* ORDERS */}

          <button
            className="dashboard-action-card"
            onClick={() => {
              document
                .getElementById("orders")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >

            <div className="dashboard-action-icon">

              <Package size={23} />

            </div>


            <div>

              <h3>
                My Orders
              </h3>

              <p>
                View your recent service orders.
              </p>

            </div>


            <ArrowRight size={19} />

          </button>


          {/* CONTACT */}

          <button
            className="dashboard-action-card"
            onClick={() =>
              navigate("/contact")
            }
          >

            <div className="dashboard-action-icon">

              <Mail size={23} />

            </div>


            <div>

              <h3>
                Contact RPS
              </h3>

              <p>
                Need help? Get in touch with our team.
              </p>

            </div>


            <ArrowRight size={19} />

          </button>

        </div>


        {/* ===================================================
            ORDERS
            =================================================== */}

        <section
          className="dashboard-orders-section"
          id="orders"
        >

          <div className="dashboard-section-heading">

            <div>

              <span>
                YOUR ACTIVITY
              </span>

              <h2>
                Recent Orders
              </h2>

            </div>


            {orders.length > 0 && (
              <span className="dashboard-order-count">
                {orders.length} recent
              </span>
            )}

          </div>


          {orders.length === 0 ? (

            <div className="dashboard-empty">

              <div className="dashboard-empty-icon">

                <Package size={30} />

              </div>


              <h3>
                No orders yet
              </h3>


              <p>
                Your RPS Associated orders will appear here
                once you book a service.
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

            <div className="dashboard-orders-list">

              {orders.map((order) => (

                <div
                  className="dashboard-order-wrapper"
                  key={order.id}
                >

                  {/* =================================================
                      ORDER SUMMARY
                      ================================================= */}

                  <div
                    className="dashboard-order-card"
                  >

                    <div className="dashboard-order-icon">

                      <Package size={21} />

                    </div>


                    <div className="dashboard-order-info">

                      <span>

                        ORDER #

                        {order.id
                          .slice(0, 8)
                          .toUpperCase()}

                      </span>


                      <h3>
                        {order.service ||
                          "Clothing Care Service"}
                      </h3>


                      <p>
                        {order.items
                          ? `${order.items} items`
                          : "Service order"}
                      </p>

                    </div>


                    <div className="dashboard-order-status">

                      <Clock3 size={15} />

                      <span>
                        {order.status ||
                          "Processing"}
                      </span>

                    </div>

                  </div>


                  {/* =================================================
                      TRACKING
                      ================================================= */}

                  <TrackingCard
                    order={order}
                  />

                </div>

              ))}

            </div>

          )}

        </section>


        {/* ===================================================
            ACCOUNT INFO
            =================================================== */}

        <section className="dashboard-account-section">

          <div className="dashboard-section-heading">

            <div>

              <span>
                ACCOUNT
              </span>

              <h2>
                Your Information
              </h2>

            </div>

          </div>


          <div className="dashboard-account-grid">

            {/* FULL NAME */}

            <div className="dashboard-info-card">

              <User size={19} />

              <div>

                <span>
                  Full Name
                </span>

                <strong>
                  {displayName}
                </strong>

              </div>

            </div>


            {/* EMAIL */}

            <div className="dashboard-info-card">

              <Mail size={19} />

              <div>

                <span>
                  Email Address
                </span>

                <strong>
                  {user.email}
                </strong>

              </div>

            </div>


            {/* STATUS */}

            <div className="dashboard-info-card">

              <CheckCircle2 size={19} />

              <div>

                <span>
                  Account Status
                </span>

                <strong>
                  Verified Account
                </strong>

              </div>

            </div>


            {/* AUTHENTICATION */}

            <div className="dashboard-info-card">

              <LogOut size={19} />

              <div>

                <span>
                  Authentication
                </span>

                <strong>
                  Firebase Secure Login
                </strong>

              </div>

            </div>

          </div>

        </section>

      </section>

    </main>
  );
}