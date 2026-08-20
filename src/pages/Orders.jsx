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
  Package,
  Shirt,
  CalendarDays,
  MapPin,
  Clock3,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { auth, db } from "../config/firebase";

import "./Orders.css";

export default function Orders() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  /*
   * =========================================================
   * AUTHENTICATION + REAL-TIME ORDERS
   * =========================================================
   */

  useEffect(() => {
    let unsubscribeOrders = null;

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          /*
           * ===================================================
           * NOT LOGGED IN
           * ===================================================
           */

          if (!currentUser) {
            setLoading(false);

            navigate("/login", {
              replace: true,
            });

            return;
          }

          setUser(currentUser);
          setLoading(true);
          setErrorMessage("");

          /*
           * ===================================================
           * CUSTOMER ORDERS QUERY
           * ===================================================
           *
           * Only the logged-in customer's orders
           * are loaded.
           */

          const ordersQuery = query(
            collection(db, "orders"),
            where(
              "uid",
              "==",
              currentUser.uid
            )
          );

          /*
           * ===================================================
           * REAL-TIME FIRESTORE LISTENER
           * ===================================================
           *
           * onSnapshot automatically fires whenever:
           *
           * - An order is created
           * - An order is updated
           * - An order is deleted
           *
           * So when admin changes:
           *
           * Processing
           *      ↓
           * Out for Delivery
           *
           * the customer page updates automatically.
           */

          unsubscribeOrders =
            onSnapshot(
              ordersQuery,
              (snapshot) => {

                const orderData =
                  snapshot.docs.map(
                    (orderDoc) => ({
                      id: orderDoc.id,
                      ...orderDoc.data(),
                    })
                  );


                /*
                 * =================================================
                 * SORT ORDERS
                 * =================================================
                 *
                 * Newest order first.
                 */

                orderData.sort(
                  (a, b) => {

                    const getTime =
                      (order) => {

                        if (
                          !order.createdAt
                        ) {
                          return 0;
                        }


                        /*
                         * Firebase Timestamp
                         */

                        if (
                          typeof order
                            .createdAt
                            .toMillis ===
                          "function"
                        ) {
                          return order
                            .createdAt
                            .toMillis();
                        }


                        /*
                         * JavaScript Date
                         */

                        if (
                          order.createdAt
                            instanceof Date
                        ) {
                          return order
                            .createdAt
                            .getTime();
                        }


                        /*
                         * String / Number fallback
                         */

                        const dateValue =
                          new Date(
                            order.createdAt
                          ).getTime();

                        return Number.isNaN(
                          dateValue
                        )
                          ? 0
                          : dateValue;
                      };


                    return (
                      getTime(b) -
                      getTime(a)
                    );
                  }
                );


                setOrders(
                  orderData
                );

                setLoading(false);
                setErrorMessage("");
              },


              /*
               * =================================================
               * REAL-TIME ERROR
               * =================================================
               */

              (error) => {

                console.error(
                  "Real-time orders error:",
                  error
                );

                setOrders([]);

                setLoading(false);

                setErrorMessage(
                  "Unable to load your orders right now. Please try again."
                );
              }
            );
        }
      );


    /*
     * =========================================================
     * CLEANUP
     * =========================================================
     *
     * Stop Firestore listener when leaving the page.
     */

    return () => {

      unsubscribeAuth();

      if (
        unsubscribeOrders
      ) {
        unsubscribeOrders();
      }
    };

  }, [navigate]);


  /*
   * ===========================================================
   * LOADING
   * ===========================================================
   */

  if (loading) {
    return (
      <main className="orders-page">

        <div className="orders-loading">

          <div className="orders-loader"></div>

          <p>
            Loading your orders...
          </p>

        </div>

      </main>
    );
  }


  /*
   * ===========================================================
   * PAGE
   * ===========================================================
   */

  return (
    <main className="orders-page">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="orders-hero">

        <div className="orders-hero-content">

          <div className="orders-label">

            <ShoppingBag
              size={15}
            />

            <span>
              MY ORDERS
            </span>

          </div>


          <h1>
            Your
            <br />

            <span>
              orders.
            </span>
          </h1>


          <p>
            View your RPS Associated service orders,
            pickup details and current order status.
          </p>

        </div>

      </section>


      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="orders-container">


        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="orders-section-heading">

          <div>

            <span>
              ORDER HISTORY
            </span>

            <h2>

              {orders.length === 0
                ? "No orders yet"
                : `${orders.length} ${
                    orders.length === 1
                      ? "Order"
                      : "Orders"
                  }`}

            </h2>

          </div>

        </div>


        {/* ===================================================
            ERROR
        ==================================================== */}

        {errorMessage && (

          <div
            className="orders-empty"
            style={{
              marginBottom:
                "25px",
            }}
          >

            <div className="orders-empty-icon">

              <AlertCircle
                size={32}
              />

            </div>


            <h3>
              Unable to load orders
            </h3>


            <p>
              {errorMessage}
            </p>


            <button
              className="orders-primary-button"
              onClick={() =>
                window.location.reload()
              }
            >

              Try Again

              <ArrowRight
                size={17}
              />

            </button>

          </div>
        )}


        {/* ===================================================
            EMPTY STATE
        ==================================================== */}

        {!errorMessage &&
        orders.length === 0 ? (

          <div className="orders-empty">

            <div className="orders-empty-icon">

              <Package
                size={32}
              />

            </div>


            <h3>
              No orders yet
            </h3>


            <p>
              You haven't booked any RPS Associated
              services yet.
            </p>


            <button
              className="orders-primary-button"
              onClick={() =>
                navigate(
                  "/book-service"
                )
              }
            >

              Book a Service

              <ArrowRight
                size={17}
              />

            </button>

          </div>

        ) : (

          /*
           * =================================================
           * ORDERS LIST
           * =================================================
           */

          !errorMessage && (

            <div className="orders-list">

              {orders.map(
                (order) => {

                  /*
                   * =============================================
                   * CLOTHING
                   * =============================================
                   */

                  const clothing =
                    order.clothingItems ||
                    {};


                  const totalItems =
                    Number(
                      clothing.shirts ||
                        0
                    ) +
                    Number(
                      clothing.trousers ||
                        0
                    ) +
                    Number(
                      clothing.tShirts ||
                        0
                    ) +
                    Number(
                      clothing.dresses ||
                        0
                    ) +
                    Number(
                      clothing.other ||
                        0
                    );


                  /*
                   * =============================================
                   * STATUS
                   * =============================================
                   */

                  const orderStatus =
                    order.status ||
                    "Processing";


                  /*
                   * =============================================
                   * ORDER CARD
                   * =============================================
                   */

                  return (

                    <article
                      className="order-card"
                      key={order.id}
                    >


                      {/* =======================================
                          TOP
                      ======================================== */}

                      <div className="order-card-top">


                        <div className="order-icon">

                          <Package
                            size={23}
                          />

                        </div>


                        <div className="order-main-info">

                          <span className="order-number">

                            ORDER #

                            {order.id
                              .slice(
                                0,
                                8
                              )
                              .toUpperCase()}

                          </span>


                          <h3>

                            {order.service ||
                              "Professional Ironing"}

                          </h3>

                        </div>


                        {/* ===================================
                            LIVE STATUS
                        ==================================== */}

                        <div className="order-status">

                          <Clock3
                            size={15}
                          />

                          <span>
                            {orderStatus}
                          </span>

                        </div>

                      </div>


                      {/* =======================================
                          DETAILS
                      ======================================== */}

                      <div className="order-details">


                        {/* CLOTHING */}

                        <div className="order-detail">

                          <Shirt
                            size={17}
                          />

                          <div>

                            <span>
                              Clothing
                            </span>

                            <strong>

                              {totalItems}{" "}

                              {totalItems ===
                              1
                                ? "item"
                                : "items"}

                            </strong>

                          </div>

                        </div>


                        {/* PICKUP DATE */}

                        <div className="order-detail">

                          <CalendarDays
                            size={17}
                          />

                          <div>

                            <span>
                              Pickup Date
                            </span>

                            <strong>

                              {order.pickupDate ||
                                "Not selected"}

                            </strong>

                          </div>

                        </div>


                        {/* ADDRESS */}

                        <div className="order-detail">

                          <MapPin
                            size={17}
                          />

                          <div>

                            <span>
                              Pickup Address
                            </span>

                            <strong>

                              {order.pickupAddress ||
                                "Not available"}

                            </strong>

                          </div>

                        </div>


                      </div>


                      {/* =======================================
                          FOOTER
                      ======================================== */}

                      <div className="order-card-footer">


                        <div className="order-created">

                          <CheckCircle2
                            size={15}
                          />

                          <span>
                            Order successfully placed
                          </span>

                        </div>


                        <button
                          className="order-view-button"
                          onClick={() =>
                            navigate(
                              `/order/${order.id}`
                            )
                          }
                        >

                          View Order

                          <ArrowRight
                            size={17}
                          />

                        </button>


                      </div>


                    </article>

                  );
                }
              )}

            </div>

          )
        )}

      </section>

    </main>
  );
}