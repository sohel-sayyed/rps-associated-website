import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import {
  Shirt,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";

import { auth } from "../config/firebase";
import "./BookService.css";

export default function BookService() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // CLOTHING QUANTITY
  // =====================================================

  const [items, setItems] = useState({
    shirts: 0,
    tShirts: 0,
    trousers: 0,
    blazer: 0,
    dresses: 0,
    other: 0,
  });

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (!currentUser) {
          navigate("/login");
          return;
        }

        setUser(currentUser);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  // =====================================================
  // UPDATE CLOTHING QUANTITY
  // =====================================================

  const updateItem = (item, amount) => {
    setItems((previous) => ({
      ...previous,
      [item]: Math.max(0, previous[item] + amount),
    }));
  };

  // =====================================================
  // TOTAL ITEMS
  // =====================================================

  const totalItems =
    items.shirts +
    items.tShirts +
    items.trousers +
    items.blazer +
    items.dresses +
    items.other;

  // =====================================================
  // CONTINUE TO PICKUP & DELIVERY
  // =====================================================

  const handleContinue = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (totalItems === 0) {
      alert("Please select at least one clothing item.");
      return;
    }

    // Save selected clothing quantities
    sessionStorage.setItem(
      "rpsBookingItems",
      JSON.stringify(items)
    );

    // Save total clothing count
    sessionStorage.setItem(
      "rpsBookingTotal",
      String(totalItems)
    );

    navigate("/pickup-delivery");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="book-service-page">
        <div className="book-service-loading">
          <div className="book-service-spinner" />

          <p>
            Loading booking page...
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <main className="book-service-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="book-service-hero">

        <div className="book-service-hero-inner">

          <div className="book-service-eyebrow">
            <CheckCircle2 size={16} />

            <span>
              BOOK RPS SERVICE
            </span>
          </div>

          <h1>
            Professional
            <span> Ironing.</span>
          </h1>

          <p>
            Select the clothes you want us to
            professionally press and prepare for pickup.
          </p>

        </div>

        {/* HERO DECORATION */}

        <div className="book-service-hero-decoration">

          <div className="hero-shirt-icon">
            <Shirt size={58} />
          </div>

          <div className="hero-available-badge">
            <CheckCircle2 size={14} />

            <span>
              Available
            </span>
          </div>

        </div>

      </section>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="book-service-container">

        {/* =================================================
            SELECTED SERVICE
        ================================================= */}

        <div className="book-service-selected">

          <div className="book-service-selected-left">

            <div className="book-service-selected-icon">
              <Shirt size={24} />
            </div>

            <div>

              <span>
                SELECTED SERVICE
              </span>

              <h2>
                Professional Ironing
              </h2>

              <p>
                Professional pressing for crisp,
                fresh and ready-to-wear clothes.
              </p>

            </div>

          </div>

          <div className="book-service-available">

            <CheckCircle2 size={15} />

            <span>
              Available
            </span>

          </div>

        </div>


        {/* =================================================
            CLOTHING SECTION HEADING
        ================================================= */}

        <div className="book-service-section-heading">

          <div>

            <span>
              CLOTHING
            </span>

            <h2>
              Select your clothes
            </h2>

            <p>
              Choose the quantity of each clothing type.
            </p>

          </div>

          <div className="book-service-items-count">

            <ShoppingBag size={17} />

            <strong>
              {totalItems}
            </strong>

            <span>
              {totalItems === 1 ? "Item" : "Items"}
            </span>

          </div>

        </div>


        {/* =================================================
            CLOTHING GRID
        ================================================= */}

        <div className="book-service-grid">

          {/* =================================================
              SHIRTS
          ================================================= */}

          <ClothingItem
            image="/assets/clothes/shirt.jpg"
            label="Shirts"
            description="Formal & casual shirts"
            value={items.shirts}
            onMinus={() =>
              updateItem("shirts", -1)
            }
            onPlus={() =>
              updateItem("shirts", 1)
            }
          />


          {/* =================================================
              T-SHIRTS
          ================================================= */}

          <ClothingItem
            image="/assets/clothes/tshirt.jpeg"
            label="T-Shirts"
            description="Tops & casual wear"
            value={items.tShirts}
            onMinus={() =>
              updateItem("tShirts", -1)
            }
            onPlus={() =>
              updateItem("tShirts", 1)
            }
          />


          {/* =================================================
              TROUSERS
          ================================================= */}

          <ClothingItem
            image="/assets/clothes/trouser.png"
            label="Trousers"
            description="Pants & formal wear"
            value={items.trousers}
            onMinus={() =>
              updateItem("trousers", -1)
            }
            onPlus={() =>
              updateItem("trousers", 1)
            }
          />


          {/* =================================================
              BLAZER
          ================================================= */}

          <ClothingItem
            image="/assets/clothes/blazer.png"
            label="Blazer"
            description="Formal & premium wear"
            value={items.blazer}
            onMinus={() =>
              updateItem("blazer", -1)
            }
            onPlus={() =>
              updateItem("blazer", 1)
            }
          />


          {/* =================================================
              DRESSES
          ================================================= */}

          <ClothingItem
            image="/assets/clothes/kurti.png"
            label="Dresses"
            description="Dresses & long wear"
            value={items.dresses}
            onMinus={() =>
              updateItem("dresses", -1)
            }
            onPlus={() =>
              updateItem("dresses", 1)
            }
          />


          {/* =================================================
              OTHER
          ================================================= */}

          <ClothingItem
            image="/assets/clothes/others.jpeg"
            label="Other"
            description="Other clothing items"
            value={items.other}
            onMinus={() =>
              updateItem("other", -1)
            }
            onPlus={() =>
              updateItem("other", 1)
            }
          />

        </div>


        {/* =================================================
            TOTAL SUMMARY
        ================================================= */}

        <div className="book-service-summary">

          <div className="book-service-summary-left">

            <div className="book-service-summary-icon">
              <ShoppingBag size={22} />
            </div>

            <div>

              <span>
                TOTAL CLOTHES
              </span>

              <h3>
                {totalItems}{" "}
                {totalItems === 1
                  ? "Item"
                  : "Items"}
              </h3>

            </div>

          </div>


          <div
            className={
              totalItems > 0
                ? "book-service-ready"
                : "book-service-not-ready"
            }
          >

            {totalItems > 0 ? (
              <>
                <CheckCircle2 size={16} />
                Ready to continue
              </>
            ) : (
              "Select clothes to continue"
            )}

          </div>

        </div>


        {/* =================================================
            CONTINUE BUTTON
        ================================================= */}

        <div className="book-service-actions">

          <button
            type="button"
            className="book-service-continue"
            onClick={handleContinue}
            disabled={totalItems === 0}
          >

            <span>
              Continue to Pickup & Delivery
            </span>

            <ArrowRight size={18} />

          </button>

        </div>

      </section>

    </main>
  );
}


/* ============================================================
   CLOTHING CARD COMPONENT
============================================================ */

function ClothingItem({
  image,
  label,
  description,
  value,
  onMinus,
  onPlus,
}) {
  return (
    <div className="book-clothing-card">

      {/* =================================================
          IMAGE
      ================================================= */}

      <div className="book-clothing-image-wrapper">

        <img
          src={image}
          alt={label}
          className="book-clothing-image"
        />

      </div>


      {/* =================================================
          CLOTHING INFORMATION
      ================================================= */}

      <div className="book-clothing-info">

        <h3>
          {label}
        </h3>

        <p>
          {description}
        </p>

      </div>


      {/* =================================================
          DIVIDER
      ================================================= */}

      <div className="book-clothing-divider" />


      {/* =================================================
          QUANTITY
      ================================================= */}

      <div className="book-clothing-bottom">

        <span className="book-clothing-quantity-label">
          Quantity
        </span>

        <div className="book-quantity-control">

          {/* MINUS */}

          <button
            type="button"
            onClick={onMinus}
            disabled={value === 0}
            aria-label={`Decrease ${label}`}
          >
            <Minus size={15} />
          </button>


          {/* QUANTITY */}

          <strong>
            {value}
          </strong>


          {/* PLUS */}

          <button
            type="button"
            onClick={onPlus}
            aria-label={`Increase ${label}`}
          >
            <Plus size={15} />
          </button>

        </div>

      </div>

    </div>
  );
}