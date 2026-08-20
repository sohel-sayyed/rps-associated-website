import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  Shirt,
  MapPin,
  Phone,
  CalendarDays,
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Package,
} from "lucide-react";

import { auth, db } from "../config/firebase";

export default function PickupDelivery() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [items, setItems] = useState({
    shirts: 0,
    trousers: 0,
    tShirts: 0,
    dresses: 0,
    other: 0,
  });

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    pickupDate: "",
    instructions: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // =========================================================
  // AUTH + BOOKING DATA
  // =========================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (!currentUser) {
          navigate("/login");
          return;
        }

        setUser(currentUser);

        // Get selected clothes from BookService
        const savedItems =
          sessionStorage.getItem("rpsBookingItems");

        if (!savedItems) {
          navigate("/book-service");
          return;
        }

        try {
          setItems(JSON.parse(savedItems));
        } catch (error) {
          console.error(
            "Unable to read booking items:",
            error
          );

          navigate("/book-service");
          return;
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [navigate]);


  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // =========================================================
  // TOTAL ITEMS
  // =========================================================

  const totalItems =
    Number(items.shirts || 0) +
    Number(items.trousers || 0) +
    Number(items.tShirts || 0) +
    Number(items.dresses || 0) +
    Number(items.other || 0);


  // =========================================================
  // PLACE ORDER
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (totalItems <= 0) {
      setErrorMessage(
        "No clothing items selected. Please go back and select your clothes."
      );
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMessage(
        "Please enter your phone number."
      );
      return;
    }

    if (!formData.address.trim()) {
      setErrorMessage(
        "Please enter your pickup address."
      );
      return;
    }

    if (!formData.pickupDate) {
      setErrorMessage(
        "Please select a pickup date."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // =====================================================
      // CREATE FIRESTORE ORDER
      // =====================================================

      await addDoc(collection(db, "orders"), {
        uid: user.uid,

        customerName:
          user.displayName ||
          user.email?.split("@")[0] ||
          "Customer",

        email: user.email || "",

        phone: formData.phone.trim(),

        service: "Professional Ironing",

        serviceType: "ironing",

        items: totalItems,

        clothingItems: {
          shirts: Number(items.shirts || 0),
          trousers: Number(items.trousers || 0),
          tShirts: Number(items.tShirts || 0),
          dresses: Number(items.dresses || 0),
          other: Number(items.other || 0),
        },

        pickupAddress: formData.address.trim(),

        pickupDate: formData.pickupDate,

        instructions:
          formData.instructions.trim(),

        status: "Processing",

        tracking: {
          enabled: false,
          status: "not_started",
          latitude: null,
          longitude: null,
          accuracy: null,
          agentId: null,
          updatedAt: null,
        },

        createdAt: serverTimestamp(),
      });

      // Clear temporary booking data
      sessionStorage.removeItem(
        "rpsBookingItems"
      );

      sessionStorage.removeItem(
        "rpsBookingTotal"
      );

      setSuccessMessage(
        "Your order has been placed successfully!"
      );

      // Redirect to My Orders
      setTimeout(() => {
        navigate("/orders");
      }, 1500);

    } catch (error) {
      console.error(
        "Order creation error:",
        error
      );

      setErrorMessage(
        "Unable to place your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
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
            Loading pickup details...
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
            <MapPin size={15} />

            <span>
              PICKUP & DELIVERY
            </span>
          </div>

          <h1>
            Almost
            <br />
            <span>there.</span>
          </h1>

          <p>
            Tell us where and when you would like
            us to collect your clothes.
          </p>

        </div>

      </section>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="dashboard-container">

        {/* =================================================
            ORDER SUMMARY
        ================================================= */}

        <div className="dashboard-profile-card">

          <div className="dashboard-profile-icon">
            <Package size={25} />
          </div>

          <div className="dashboard-profile-info">

            <span className="dashboard-small-label">
              ORDER SUMMARY
            </span>

            <h2>
              Professional Ironing
            </h2>

            <div className="dashboard-email">
              <span>
                {totalItems}{" "}
                {totalItems === 1
                  ? "clothing item"
                  : "clothing items"}
              </span>
            </div>

          </div>

          <div className="dashboard-account-status">
            <CheckCircle2 size={15} />
            <span>
              Ready
            </span>
          </div>

        </div>


        {/* =================================================
            CLOTHING SUMMARY
        ================================================= */}

        <div className="dashboard-section-heading">

          <div>
            <span>
              CLOTHING
            </span>

            <h2>
              Selected items
            </h2>
          </div>

        </div>


        <div className="dashboard-account-grid">

          <SummaryItem
            label="Shirts"
            value={items.shirts}
          />

          <SummaryItem
            label="Trousers"
            value={items.trousers}
          />

          <SummaryItem
            label="T-Shirts"
            value={items.tShirts}
          />

          <SummaryItem
            label="Dresses"
            value={items.dresses}
          />

          <SummaryItem
            label="Other"
            value={items.other}
          />

        </div>


        {/* =================================================
            PICKUP FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
        >

          <div
            className="dashboard-section-heading"
            style={{
              marginTop: "45px",
            }}
          >

            <div>
              <span>
                PICKUP DETAILS
              </span>

              <h2>
                Where should we come?
              </h2>
            </div>

          </div>


          {/* Phone + Date */}

          <div className="dashboard-account-grid">

            {/* Phone */}

            <div className="dashboard-info-card">

              <Phone size={19} />

              <div
                style={{
                  width: "100%",
                }}
              >

                <span>
                  Phone Number
                </span>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  style={{
                    width: "100%",
                    marginTop: "8px",
                  }}
                />

              </div>

            </div>


            {/* Date */}

            <div className="dashboard-info-card">

              <CalendarDays size={19} />

              <div
                style={{
                  width: "100%",
                }}
              >

                <span>
                  Pickup Date
                </span>

                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  required
                  style={{
                    width: "100%",
                    marginTop: "8px",
                  }}
                />

              </div>

            </div>

          </div>


          {/* Address */}

          <div
            className="dashboard-info-card"
            style={{
              marginTop: "15px",
              alignItems: "flex-start",
            }}
          >

            <MapPin size={19} />

            <div
              style={{
                width: "100%",
              }}
            >

              <span>
                Pickup Address
              </span>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete pickup address"
                rows="4"
                required
                style={{
                  width: "100%",
                  marginTop: "8px",
                  resize: "vertical",
                }}
              />

            </div>

          </div>


          {/* Instructions */}

          <div
            className="dashboard-info-card"
            style={{
              marginTop: "15px",
              alignItems: "flex-start",
            }}
          >

            <FileText size={19} />

            <div
              style={{
                width: "100%",
              }}
            >

              <span>
                Special Instructions
              </span>

              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Any special instructions? (Optional)"
                rows="3"
                style={{
                  width: "100%",
                  marginTop: "8px",
                  resize: "vertical",
                }}
              />

            </div>

          </div>


          {/* =================================================
              MESSAGES
          ================================================= */}

          {errorMessage && (
            <div
              className="dashboard-empty"
              style={{
                marginTop: "25px",
              }}
            >

              <p>
                {errorMessage}
              </p>

            </div>
          )}


          {successMessage && (
            <div
              className="dashboard-empty"
              style={{
                marginTop: "25px",
              }}
            >

              <CheckCircle2 size={30} />

              <h3>
                Order placed successfully!
              </h3>

              <p>
                Redirecting you to My Orders...
              </p>

            </div>
          )}


          {/* =================================================
              BUTTONS
          ================================================= */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "15px",
              marginTop: "30px",
              flexWrap: "wrap",
            }}
          >

            <button
              type="button"
              className="dashboard-primary-button"
              onClick={() =>
                navigate("/book-service")
              }
              style={{
                background: "#ffffff",
                color: "#7c3aed",
                border: "1px solid #d8c8f5",
                boxShadow: "none",
              }}
            >

              <ArrowLeft size={17} />

              Back to Clothes

            </button>


            <button
              type="submit"
              className="dashboard-primary-button"
              disabled={isSubmitting}
            >

              {isSubmitting
                ? "Placing Order..."
                : "Place Order"}

              {!isSubmitting && (
                <ArrowRight size={18} />
              )}

            </button>

          </div>

        </form>

      </section>

    </main>
  );
}


/* ============================================================
   SUMMARY ITEM
============================================================ */

function SummaryItem({
  label,
  value,
}) {
  const quantity = Number(value || 0);

  return (
    <div className="dashboard-info-card">

      <Shirt size={19} />

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