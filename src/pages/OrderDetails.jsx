import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  ArrowLeft,
  ArrowRight,
  Package,
  Shirt,
  MapPin,
  Phone,
  CalendarDays,
  FileText,
  Clock3,
  CheckCircle2,
  Circle,
  Navigation,
  ShoppingBag,
} from "lucide-react";

import { auth, db } from "../config/firebase";

import "./OrderDetails.css";

export default function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // =========================================================
  // AUTH + ORDER
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

        if (!orderId) {
          setErrorMessage("Order ID is missing.");
          setLoading(false);
          return;
        }

        try {
          const orderRef = doc(
            db,
            "orders",
            orderId
          );

          const orderSnapshot = await getDoc(
            orderRef
          );

          if (!orderSnapshot.exists()) {
            setErrorMessage(
              "This order could not be found."
            );
            setLoading(false);
            return;
          }

          const orderData = {
            id: orderSnapshot.id,
            ...orderSnapshot.data(),
          };

          // ===================================================
          // SECURITY CHECK
          // Customer can only view their own order
          // ===================================================

          if (orderData.uid !== currentUser.uid) {
            setErrorMessage(
              "You are not authorized to view this order."
            );

            setLoading(false);
            return;
          }

          setOrder(orderData);

        } catch (error) {
          console.error(
            "Error loading order:",
            error
          );

          setErrorMessage(
            "Unable to load this order. Please try again."
          );
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [navigate, orderId]);


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="order-details-page">

        <div className="order-details-loading">

          <div className="order-details-loader"></div>

          <p>
            Loading your order...
          </p>

        </div>

      </main>
    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (errorMessage || !order) {
    return (
      <main className="order-details-page">

        <section className="order-details-container">

          <div className="order-details-error">

            <div className="order-details-error-icon">
              <Package size={30} />
            </div>

            <h2>
              Order unavailable
            </h2>

            <p>
              {errorMessage ||
                "We could not find this order."}
            </p>

            <button
              className="order-details-primary-button"
              onClick={() =>
                navigate("/orders")
              }
            >
              <ArrowLeft size={17} />
              Back to My Orders
            </button>

          </div>

        </section>

      </main>
    );
  }


  // =========================================================
  // ORDER DATA
  // =========================================================

  const clothing =
    order.clothingItems || {};

  const totalItems =
    Number(clothing.shirts || 0) +
    Number(clothing.trousers || 0) +
    Number(clothing.tShirts || 0) +
    Number(clothing.dresses || 0) +
    Number(clothing.other || 0);


  // =========================================================
  // STATUS
  // =========================================================

  const currentStatus =
    (order.status || "Processing")
      .toLowerCase()
      .replace(/_/g, " ");


  const statusSteps = [
    {
      key: "placed",
      label: "Order Placed",
      description:
        "Your service order has been received.",
    },
    {
      key: "pickup",
      label: "Pickup Scheduled",
      description:
        "Your clothes are scheduled for pickup.",
    },
    {
      key: "processing",
      label: "Processing",
      description:
        "Your clothes are being professionally handled.",
    },
    {
      key: "ready",
      label: "Ready",
      description:
        "Your clothes are ready for delivery.",
    },
    {
      key: "delivery",
      label: "Out for Delivery",
      description:
        "Your clothes are on their way to you.",
    },
    {
      key: "delivered",
      label: "Delivered",
      description:
        "Your order has been delivered successfully.",
    },
  ];


  const getStatusIndex = () => {

    if (
      currentStatus.includes("delivered")
    ) {
      return 5;
    }

    if (
      currentStatus.includes("delivery") ||
      currentStatus.includes("out for")
    ) {
      return 4;
    }

    if (
      currentStatus.includes("ready")
    ) {
      return 3;
    }

    if (
      currentStatus.includes("processing") ||
      currentStatus.includes("process")
    ) {
      return 2;
    }

    if (
      currentStatus.includes("pickup") ||
      currentStatus.includes("scheduled")
    ) {
      return 1;
    }

    return 0;
  };


  const currentStatusIndex =
    getStatusIndex();


  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (dateValue) => {

    if (!dateValue) {
      return "Not available";
    }

    try {

      if (
        typeof dateValue === "string"
      ) {
        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
          return dateValue;
        }

        return date.toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        );
      }

      if (
        dateValue?.toDate
      ) {
        return dateValue
          .toDate()
          .toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          );
      }

      return "Not available";

    } catch {
      return "Not available";
    }
  };


  // =========================================================
  // ORDER CREATED DATE
  // =========================================================

  const createdDate =
    formatDate(order.createdAt);


  // =========================================================
  // TRACKING STATUS
  // =========================================================

  const trackingEnabled =
    order.tracking?.enabled === true;


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="order-details-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="order-details-hero">

        <div className="order-details-hero-content">

          <button
            className="order-details-back-button"
            onClick={() =>
              navigate("/orders")
            }
          >
            <ArrowLeft size={17} />
            Back to My Orders
          </button>


          <div className="order-details-label">

            <ShoppingBag size={15} />

            <span>
              ORDER DETAILS
            </span>

          </div>


          <h1>
            Your order
            <br />
            <span>is here.</span>
          </h1>


          <p>
            View your service details,
            pickup information and current
            order status.
          </p>

        </div>

      </section>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="order-details-container">


        {/* ===================================================
            ORDER HEADER CARD
        =================================================== */}

        <div className="order-details-main-card">

          <div className="order-details-main-top">

            <div className="order-details-main-icon">
              <Package size={27} />
            </div>


            <div className="order-details-main-info">

              <span>
                ORDER #
                {order.id
                  .slice(0, 8)
                  .toUpperCase()}
              </span>

              <h2>
                {order.service ||
                  "Professional Ironing"}
              </h2>

              <p>
                Placed on {createdDate}
              </p>

            </div>


            <div className="order-details-status-badge">

              <Clock3 size={15} />

              <span>
                {order.status ||
                  "Processing"}
              </span>

            </div>

          </div>

        </div>


        {/* ===================================================
            STATUS TIMELINE
        =================================================== */}

        <section className="order-details-section">

          <div className="order-details-section-heading">

            <div>

              <span>
                ORDER PROGRESS
              </span>

              <h2>
                Track your order status
              </h2>

            </div>

          </div>


          <div className="order-status-timeline">

            {statusSteps.map(
              (step, index) => {

                const completed =
                  index <=
                  currentStatusIndex;

                const current =
                  index ===
                  currentStatusIndex;

                return (
                  <div
                    className={`order-status-step ${
                      completed
                        ? "completed"
                        : ""
                    } ${
                      current
                        ? "current"
                        : ""
                    }`}
                    key={step.key}
                  >

                    <div className="order-status-icon">

                      {completed ? (
                        <CheckCircle2
                          size={20}
                        />
                      ) : (
                        <Circle
                          size={20}
                        />
                      )}

                    </div>


                    <div className="order-status-content">

                      <h3>
                        {step.label}
                      </h3>

                      <p>
                        {current
                          ? step.description
                          : index <
                            currentStatusIndex
                          ? "Completed"
                          : "Waiting"}
                      </p>

                    </div>


                    {index <
                      statusSteps.length - 1 && (
                      <div className="order-status-line"></div>
                    )}

                  </div>
                );
              }
            )}

          </div>

        </section>


        {/* ===================================================
            TRACKING
        =================================================== */}

        <section className="order-details-tracking-card">

          <div className="order-details-tracking-icon">

            <Navigation size={24} />

          </div>


          <div className="order-details-tracking-content">

            <span>
              LIVE ORDER TRACKING
            </span>

            <h2>
              Track your clothes
            </h2>

            <p>
              Once your pickup or delivery
              is active, you will be able to
              see the current location of
              your order.
            </p>

          </div>


          <button
            className="order-details-track-button"
            disabled={!trackingEnabled}
            onClick={() => {

              if (!trackingEnabled) {
                return;
              }

              navigate(
                `/order/${order.id}/tracking`
              );

            }}
          >

            {trackingEnabled
              ? "Track Order"
              : "Tracking Not Active"}

            <ArrowRight size={17} />

          </button>

        </section>


        {/* ===================================================
            CLOTHING DETAILS
        =================================================== */}

        <section className="order-details-section">

          <div className="order-details-section-heading">

            <div>

              <span>
                CLOTHING
              </span>

              <h2>
                Your selected items
              </h2>

            </div>

            <div className="order-details-count">

              <Shirt size={16} />

              <span>
                {totalItems}{" "}
                {totalItems === 1
                  ? "item"
                  : "items"}
              </span>

            </div>

          </div>


          <div className="order-clothing-grid">

            <ClothingItem
              label="Shirts"
              value={clothing.shirts}
            />

            <ClothingItem
              label="Trousers"
              value={clothing.trousers}
            />

            <ClothingItem
              label="T-Shirts"
              value={clothing.tShirts}
            />

            <ClothingItem
              label="Dresses"
              value={clothing.dresses}
            />

            <ClothingItem
              label="Other"
              value={clothing.other}
            />

          </div>

        </section>


        {/* ===================================================
            PICKUP DETAILS
        =================================================== */}

        <section className="order-details-section">

          <div className="order-details-section-heading">

            <div>

              <span>
                PICKUP & DELIVERY
              </span>

              <h2>
                Service details
              </h2>

            </div>

          </div>


          <div className="order-info-grid">

            {/* Phone */}

            <InfoCard
              icon={<Phone size={19} />}
              label="Phone Number"
              value={
                order.phone ||
                user?.phoneNumber ||
                "Not available"
              }
            />


            {/* Pickup Date */}

            <InfoCard
              icon={
                <CalendarDays size={19} />
              }
              label="Pickup Date"
              value={formatDate(
                order.pickupDate
              )}
            />


            {/* Address */}

            <InfoCard
              icon={<MapPin size={19} />}
              label="Pickup Address"
              value={
                order.pickupAddress ||
                "Not available"
              }
            />


            {/* Instructions */}

            <InfoCard
              icon={<FileText size={19} />}
              label="Special Instructions"
              value={
                order.instructions?.trim()
                  ? order.instructions
                  : "No special instructions"
              }
            />

          </div>

        </section>


        {/* ===================================================
            CUSTOMER INFORMATION
        =================================================== */}

        <section className="order-details-section">

          <div className="order-details-section-heading">

            <div>

              <span>
                CUSTOMER
              </span>

              <h2>
                Account information
              </h2>

            </div>

          </div>


          <div className="order-info-grid">

            <InfoCard
              icon={<ShoppingBag size={19} />}
              label="Customer Name"
              value={
                order.customerName ||
                user?.displayName ||
                "Customer"
              }
            />


            <InfoCard
              icon={<FileText size={19} />}
              label="Email Address"
              value={
                order.email ||
                user?.email ||
                "Not available"
              }
            />

          </div>

        </section>


        {/* ===================================================
            BOTTOM ACTIONS
        =================================================== */}

        <div className="order-details-actions">

          <button
            className="order-details-secondary-button"
            onClick={() =>
              navigate("/orders")
            }
          >

            <ArrowLeft size={17} />

            My Orders

          </button>


          <button
            className="order-details-primary-button"
            onClick={() =>
              navigate("/book-service")
            }
          >

            Book Another Service

            <ArrowRight size={17} />

          </button>

        </div>

      </section>

    </main>
  );
}


// ============================================================
// CLOTHING ITEM
// ============================================================

function ClothingItem({
  label,
  value,
}) {

  const quantity =
    Number(value || 0);

  return (
    <div className="order-clothing-item">

      <div className="order-clothing-icon">
        <Shirt size={19} />
      </div>

      <div>

        <span>
          {label}
        </span>

        <strong>
          {quantity}{" "}
          {quantity === 1
            ? "item"
            : "items"}
        </strong>

      </div>

    </div>
  );
}


// ============================================================
// INFO CARD
// ============================================================

function InfoCard({
  icon,
  label,
  value,
}) {

  return (
    <div className="order-info-card">

      <div className="order-info-icon">
        {icon}
      </div>

      <div className="order-info-content">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}