import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  Truck,
  Package,
  User,
  Phone,
  MapPin,
  CalendarDays,
  Clock3,
  CheckCircle2,
  LogOut,
  Loader2,
  AlertCircle,
  Navigation,
  Shirt,
} from "lucide-react";

import { auth, db } from "../config/firebase";

import "./DeliveryPartnerDashboard.css";


export default function DeliveryPartnerDashboard() {

  const navigate = useNavigate();


  // =========================================================
  // STATE
  // =========================================================

  const [partner, setPartner] = useState(null);

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [updatingId, setUpdatingId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);


  // =========================================================
  // AUTH + REALTIME ASSIGNED ORDERS
  // =========================================================

  useEffect(() => {

    let ordersUnsubscribe = null;

    const authUnsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {

          // ---------------------------------------------------
          // NOT LOGGED IN
          // ---------------------------------------------------

          if (!currentUser) {

            setPartner(null);

            setOrders([]);

            setLoading(false);

            navigate("/login", {
              replace: true,
            });

            return;
          }


          try {

            // -------------------------------------------------
            // GET USER DOCUMENT
            // -------------------------------------------------

            const userRef = doc(
              db,
              "users",
              currentUser.uid
            );

            const userSnapshot =
              await getDoc(userRef);


            // -------------------------------------------------
            // USER DOCUMENT NOT FOUND
            // -------------------------------------------------

            if (!userSnapshot.exists()) {

              setLoading(false);

              navigate("/dashboard", {
                replace: true,
              });

              return;
            }


            const userData =
              userSnapshot.data();


            // -------------------------------------------------
            // DELIVERY PARTNER ROLE CHECK
            // -------------------------------------------------

            if (
              userData.role !==
              "delivery_partner"
            ) {

              setLoading(false);

              navigate("/dashboard", {
                replace: true,
              });

              return;
            }


            // -------------------------------------------------
            // SAVE PARTNER DATA
            // -------------------------------------------------

            setPartner({
              uid: currentUser.uid,

              name:
                userData.name ||
                "Delivery Partner",

              email:
                currentUser.email ||
                userData.email ||
                "",

              phone:
                userData.phone ||
                "",

              role:
                userData.role,

              isActive:
                userData.isActive !== false,
            });


            // -------------------------------------------------
            // REALTIME ASSIGNED ORDERS
            // -------------------------------------------------

            const ordersQuery =
              query(
                collection(db, "orders"),

                where(
                  "deliveryPartnerId",
                  "==",
                  currentUser.uid
                )
              );


            ordersUnsubscribe =
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


                  // -------------------------------------------
                  // SORT LATEST FIRST
                  // -------------------------------------------

                  orderData.sort(
                    (a, b) => {

                      const dateA =
                        a.createdAt
                          ?.toDate?.() ||
                        new Date(0);

                      const dateB =
                        b.createdAt
                          ?.toDate?.() ||
                        new Date(0);

                      return (
                        dateB.getTime() -
                        dateA.getTime()
                      );
                    }
                  );


                  setOrders(orderData);

                  setLoading(false);
                },

                (error) => {

                  console.error(
                    "Delivery partner orders error:",
                    error
                  );

                  setErrorMessage(
                    "Unable to load assigned orders."
                  );

                  setOrders([]);

                  setLoading(false);
                }
              );

          } catch (error) {

            console.error(
              "Delivery partner authentication error:",
              error
            );

            setErrorMessage(
              "Unable to load delivery partner account."
            );

            setLoading(false);
          }
        }
      );


    // ---------------------------------------------------------
    // CLEANUP
    // ---------------------------------------------------------

    return () => {

      authUnsubscribe();

      if (ordersUnsubscribe) {
        ordersUnsubscribe();
      }

    };

  }, [navigate]);


  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {

    try {

      setUpdatingId(orderId);

      setErrorMessage("");


      // -------------------------------------------------------
      // UPDATE FIRESTORE
      // -------------------------------------------------------

      await updateDoc(
        doc(db, "orders", orderId),
        {

          status: newStatus,

          updatedAt:
            serverTimestamp(),

          // Store who performed the update
          lastUpdatedBy:
            partner?.uid || null,

          lastUpdatedByRole:
            "delivery_partner",

        }
      );


      // -------------------------------------------------------
      // UI IS UPDATED BY onSnapshot AUTOMATICALLY
      // -------------------------------------------------------

    } catch (error) {

      console.error(
        "Status update error:",
        error
      );

      setErrorMessage(
        "Unable to update order status. Please try again."
      );

    } finally {

      setUpdatingId(null);

    }
  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {

    try {

      setIsLoggingOut(true);

      await signOut(auth);

      navigate("/login", {
        replace: true,
      });

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

      setIsLoggingOut(false);

    }

  };


  // =========================================================
  // CLOTHING TOTAL
  // =========================================================

  const getTotalItems = (order) => {

    const clothing =
      order.clothingItems || {};


    return (
      Number(clothing.shirts || 0) +
      Number(clothing.trousers || 0) +
      Number(clothing.tShirts || 0) +
      Number(clothing.dresses || 0) +
      Number(clothing.other || 0)
    );

  };


  // =========================================================
  // STATUS ICON
  // =========================================================

  const getStatusIcon = (status) => {

    const normalized =
      String(status || "")
        .toLowerCase()
        .replace(/_/g, " ");


    if (
      normalized === "delivered" ||
      normalized === "completed"
    ) {

      return (
        <CheckCircle2
          size={16}
        />
      );

    }


    if (
      normalized ===
        "out for delivery"
    ) {

      return (
        <Truck
          size={16}
        />
      );

    }


    if (
      normalized === "ready"
    ) {

      return (
        <Package
          size={16}
        />
      );

    }


    if (
      normalized === "picked up"
    ) {

      return (
        <CheckCircle2
          size={16}
        />
      );

    }


    return (
      <Clock3
        size={16}
      />
    );

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <main className="delivery-page">

        <div className="delivery-loading">

          <div className="delivery-loader"></div>

          <p>
            Loading delivery dashboard...
          </p>

        </div>

      </main>

    );

  }


  // =========================================================
  // NO PARTNER
  // =========================================================

  if (!partner) {

    return null;

  }


  // =========================================================
  // DASHBOARD
  // =========================================================

  return (

    <main className="delivery-page">


      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="delivery-hero">

        <div className="delivery-hero-content">

          <div className="delivery-label">

            <Truck
              size={15}
            />

            <span>
              RPS DELIVERY PARTNER
            </span>

          </div>


          <h1>

            Welcome back,

            <br />

            <span>
              {partner.name}.
            </span>

          </h1>


          <p>
            Manage your assigned pickups,
            deliveries and order status from
            one place.
          </p>

        </div>


        {/* LIVE STATUS */}

        <div className="delivery-live-badge">

          <span className="delivery-live-dot"></span>

          <span>
            Live Firebase Data
          </span>

        </div>

      </section>



      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="delivery-container">


        {/* ===================================================
            PARTNER ACCOUNT
        ==================================================== */}

        <div className="delivery-account-card">

          <div className="delivery-account-icon">

            <User
              size={25}
            />

          </div>


          <div className="delivery-account-info">

            <span>
              DELIVERY PARTNER
            </span>

            <h2>
              {partner.name}
            </h2>

            <p>
              <Phone
                size={14}
              />

              {partner.phone ||
                "Phone not added"}

            </p>

          </div>


          <div
            className={
              partner.isActive
                ? "delivery-active-badge"
                : "delivery-inactive-badge"
            }
          >

            <span></span>

            {partner.isActive
              ? "Active"
              : "Inactive"}

          </div>

        </div>



        {/* ===================================================
            ERROR
        ==================================================== */}

        {errorMessage && (

          <div className="delivery-error">

            <AlertCircle
              size={18}
            />

            <span>
              {errorMessage}
            </span>

          </div>

        )}



        {/* ===================================================
            STATS
        ==================================================== */}

        <div className="delivery-stats-grid">


          <div className="delivery-stat-card">

            <div className="delivery-stat-icon">

              <Package
                size={21}
              />

            </div>

            <div>

              <span>
                ASSIGNED ORDERS
              </span>

              <strong>
                {orders.length}
              </strong>

            </div>

          </div>



          <div className="delivery-stat-card">

            <div className="delivery-stat-icon">

              <Clock3
                size={21}
              />

            </div>

            <div>

              <span>
                ACTIVE
              </span>

              <strong>

                {
                  orders.filter(
                    (order) =>
                      String(
                        order.status
                      ).toLowerCase() !==
                      "delivered"
                  ).length
                }

              </strong>

            </div>

          </div>



          <div className="delivery-stat-card">

            <div className="delivery-stat-icon">

              <CheckCircle2
                size={21}
              />

            </div>

            <div>

              <span>
                DELIVERED
              </span>

              <strong>

                {
                  orders.filter(
                    (order) =>
                      String(
                        order.status
                      ).toLowerCase() ===
                      "delivered"
                  ).length
                }

              </strong>

            </div>

          </div>

        </div>



        {/* ===================================================
            ORDERS
        ==================================================== */}

        <section className="delivery-orders-section">


          <div className="delivery-section-heading">

            <div>

              <span>
                ASSIGNED ORDERS
              </span>

              <h2>
                Your deliveries
              </h2>

            </div>


            <span className="delivery-order-count">

              {orders.length}{" "}

              {orders.length === 1
                ? "order"
                : "orders"}

            </span>

          </div>



          {/* =================================================
              NO ORDERS
          ================================================== */}

          {orders.length === 0 ? (

            <div className="delivery-empty">

              <div className="delivery-empty-icon">

                <Truck
                  size={30}
                />

              </div>


              <h3>
                No orders assigned
              </h3>


              <p>
                New delivery assignments will
                appear here automatically.
              </p>

            </div>

          ) : (


            /* ===============================================
               ORDER LIST
            ================================================ */

            <div className="delivery-orders-list">


              {orders.map((order) => {

                const status =
                  order.status ||
                  "Order Confirmed";


                const totalItems =
                  getTotalItems(order);


                const isUpdating =
                  updatingId ===
                  order.id;


                return (

                  <article
                    className="delivery-order-card"
                    key={order.id}
                  >


                    {/* =====================================
                        ORDER HEADER
                    ====================================== */}

                    <div className="delivery-order-header">


                      <div className="delivery-order-title">


                        <div className="delivery-order-icon">

                          <Package
                            size={23}
                          />

                        </div>


                        <div>

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
                            {totalItems}{" "}
                            {totalItems === 1
                              ? "item"
                              : "items"}
                          </p>

                        </div>

                      </div>



                      <div className="delivery-current-status">

                        {getStatusIcon(
                          status
                        )}

                        <span>
                          {status}
                        </span>

                      </div>


                    </div>



                    {/* =====================================
                        CUSTOMER INFORMATION
                    ====================================== */}

                    <div className="delivery-order-details">


                      <div className="delivery-detail-card">

                        <User
                          size={17}
                        />

                        <div>

                          <span>
                            CUSTOMER
                          </span>

                          <strong>
                            {order.customerName ||
                              "Customer"}
                          </strong>

                        </div>

                      </div>



                      <div className="delivery-detail-card">

                        <Phone
                          size={17}
                        />

                        <div>

                          <span>
                            PHONE
                          </span>

                          <strong>
                            {order.phone ||
                              "Not available"}
                          </strong>

                        </div>

                      </div>



                      <div className="delivery-detail-card">

                        <MapPin
                          size={17}
                        />

                        <div>

                          <span>
                            PICKUP ADDRESS
                          </span>

                          <strong>
                            {order.pickupAddress ||
                              "Address not available"}
                          </strong>

                        </div>

                      </div>



                      <div className="delivery-detail-card">

                        <CalendarDays
                          size={17}
                        />

                        <div>

                          <span>
                            PICKUP DATE
                          </span>

                          <strong>
                            {order.pickupDate ||
                              "Not specified"}
                          </strong>

                        </div>

                      </div>

                    </div>



                    {/* =====================================
                        CLOTHING
                    ====================================== */}

                    <div className="delivery-clothing">

                      <div className="delivery-clothing-title">

                        <Shirt
                          size={18}
                        />

                        <strong>
                          Clothing Items
                        </strong>

                      </div>


                      <div className="delivery-clothing-list">

                        <span>
                          Shirts:{" "}
                          {order.clothingItems
                            ?.shirts || 0}
                        </span>

                        <span>
                          T-Shirts:{" "}
                          {order.clothingItems
                            ?.tShirts || 0}
                        </span>

                        <span>
                          Trousers:{" "}
                          {order.clothingItems
                            ?.trousers || 0}
                        </span>

                        <span>
                          Dresses:{" "}
                          {order.clothingItems
                            ?.dresses || 0}
                        </span>

                        <span>
                          Other:{" "}
                          {order.clothingItems
                            ?.other || 0}
                        </span>

                      </div>

                    </div>



                    {/* =====================================
                        ACTIONS
                    ====================================== */}

                    <div className="delivery-actions">

                      <div>

                        <span>
                          UPDATE ORDER STATUS
                        </span>

                        <p>
                          Customer dashboard
                          updates automatically.
                        </p>

                      </div>


                      <div className="delivery-status-buttons">


                        {/* PICKUP ASSIGNED */}

                        <button
                          type="button"
                          disabled={
                            isUpdating
                          }
                          className={
                            status ===
                            "Pickup Assigned"
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              "Pickup Assigned"
                            )
                          }
                        >

                          {isUpdating &&
                          status !==
                            "Pickup Assigned" ? (
                            <Loader2
                              size={15}
                              className="spin"
                            />
                          ) : (
                            <Navigation
                              size={15}
                            />
                          )}

                          Assigned

                        </button>



                        {/* PICKED UP */}

                        <button
                          type="button"
                          disabled={
                            isUpdating
                          }
                          className={
                            status ===
                            "Picked Up"
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              "Picked Up"
                            )
                          }
                        >

                          <CheckCircle2
                            size={15}
                          />

                          Picked Up

                        </button>



                        {/* PROCESSING */}

                        <button
                          type="button"
                          disabled={
                            isUpdating
                          }
                          className={
                            status ===
                            "Processing"
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              "Processing"
                            )
                          }
                        >

                          <Clock3
                            size={15}
                          />

                          Processing

                        </button>



                        {/* READY */}

                        <button
                          type="button"
                          disabled={
                            isUpdating
                          }
                          className={
                            status ===
                            "Ready"
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              "Ready"
                            )
                          }
                        >

                          <Package
                            size={15}
                          />

                          Ready

                        </button>



                        {/* OUT FOR DELIVERY */}

                        <button
                          type="button"
                          disabled={
                            isUpdating
                          }
                          className={
                            status ===
                            "Out for Delivery"
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              "Out for Delivery"
                            )
                          }
                        >

                          <Truck
                            size={15}
                          />

                          Out for Delivery

                        </button>



                        {/* DELIVERED */}

                        <button
                          type="button"
                          disabled={
                            isUpdating
                          }
                          className={
                            status ===
                            "Delivered"
                              ? "active delivered"
                              : ""
                          }
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              "Delivered"
                            )
                          }
                        >

                          {isUpdating &&
                          status !==
                            "Delivered" ? (
                            <Loader2
                              size={15}
                              className="spin"
                            />
                          ) : (
                            <CheckCircle2
                              size={15}
                            />
                          )}

                          Delivered

                        </button>


                      </div>

                    </div>



                    {/* =====================================
                        NAVIGATION
                    ====================================== */}

                    <div className="delivery-order-footer">

                      <a
                        href={
                          order.phone
                            ? `tel:${order.phone}`
                            : "#"
                        }
                        className="delivery-call-button"
                      >

                        <Phone
                          size={16}
                        />

                        Call Customer

                      </a>


                      <a
                        href={
                          order.pickupAddress
                            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                order.pickupAddress
                              )}`
                            : "#"
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="delivery-map-button"
                      >

                        <MapPin
                          size={16}
                        />

                        Open Maps

                      </a>

                    </div>


                  </article>

                );

              })}

            </div>

          )}

        </section>



        {/* ===================================================
            LOGOUT
        ==================================================== */}

        <div className="delivery-logout-wrapper">

          <button
            type="button"
            className="delivery-logout-button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >

            {isLoggingOut ? (

              <Loader2
                size={17}
                className="spin"
              />

            ) : (

              <LogOut
                size={17}
              />

            )}

            {isLoggingOut
              ? "Logging out..."
              : "Logout"}

          </button>

        </div>


      </section>

    </main>

  );

}