import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  Package,
  Users,
  Clock3,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  RefreshCw,
  ShieldCheck,
  CalendarDays,
  Shirt,
  UserRound,
  UserCheck,
  ChevronDown,
  MapPin,
  Phone,
  AlertCircle,
} from "lucide-react";

import {
  auth,
  db,
} from "../config/firebase";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [deliveryPartners, setDeliveryPartners] =
    useState([]);

  const [adminUser, setAdminUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [assigningOrderId, setAssigningOrderId] =
    useState(null);

  const [selectedPartners, setSelectedPartners] =
    useState({});

  // =========================================================
  // ADMIN AUTHENTICATION
  // =========================================================

  useEffect(() => {
    let unsubscribeOrders = null;
    let unsubscribeCustomers = null;
    let unsubscribePartners = null;

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          // ---------------------------------------------------
          // NOT LOGGED IN
          // ---------------------------------------------------

          if (!currentUser) {
            setAdminUser(null);
            setLoading(false);

            navigate("/login", {
              replace: true,
            });

            return;
          }

          try {
            // -------------------------------------------------
            // GET USER ROLE
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
            // ADMIN ROLE CHECK
            // -------------------------------------------------

            if (
              userData.role !== "admin"
            ) {
              setLoading(false);

              navigate("/dashboard", {
                replace: true,
              });

              return;
            }

            // -------------------------------------------------
            // ADMIN VERIFIED
            // -------------------------------------------------

            setAdminUser({
              uid: currentUser.uid,
              email:
                currentUser.email || "",
              ...userData,
            });

            // -------------------------------------------------
            // ORDERS REALTIME
            // -------------------------------------------------

            unsubscribeOrders =
              onSnapshot(
                collection(db, "orders"),
                (snapshot) => {
                  const orderData =
                    snapshot.docs.map(
                      (orderDoc) => ({
                        id: orderDoc.id,
                        ...orderDoc.data(),
                      })
                    );

                  setOrders(orderData);
                  setLoading(false);
                },
                (error) => {
                  console.error(
                    "Admin orders loading error:",
                    error
                  );

                  setErrorMessage(
                    "Unable to load orders from Firebase."
                  );

                  setLoading(false);
                }
              );

            // -------------------------------------------------
            // CUSTOMERS REALTIME
            // -------------------------------------------------

            unsubscribeCustomers =
              onSnapshot(
                collection(db, "customers"),
                (snapshot) => {
                  const customerData =
                    snapshot.docs.map(
                      (customerDoc) => ({
                        id: customerDoc.id,
                        ...customerDoc.data(),
                      })
                    );

                  setCustomers(
                    customerData
                  );
                },
                (error) => {
                  console.error(
                    "Admin customers loading error:",
                    error
                  );
                }
              );

            // -------------------------------------------------
            // DELIVERY PARTNERS REALTIME
            // -------------------------------------------------

            unsubscribePartners =
              onSnapshot(
                collection(db, "users"),
                (snapshot) => {
                  const partnerData =
                    snapshot.docs
                      .map(
                        (partnerDoc) => ({
                          id: partnerDoc.id,
                          ...partnerDoc.data(),
                        })
                      )
                      .filter(
                        (user) =>
                          user.role ===
                          "delivery_partner"
                      );

                  setDeliveryPartners(
                    partnerData
                  );
                },
                (error) => {
                  console.error(
                    "Delivery partners loading error:",
                    error
                  );
                }
              );

          } catch (error) {
            console.error(
              "Admin authentication error:",
              error
            );

            setErrorMessage(
              "Unable to verify admin account."
            );

            setLoading(false);
          }
        }
      );

    // =======================================================
    // CLEANUP
    // =======================================================

    return () => {
      unsubscribeAuth();

      if (unsubscribeOrders) {
        unsubscribeOrders();
      }

      if (unsubscribeCustomers) {
        unsubscribeCustomers();
      }

      if (unsubscribePartners) {
        unsubscribePartners();
      }
    };
  }, [navigate]);

  // =========================================================
  // ASSIGN DELIVERY PARTNER
  // =========================================================

  const assignDeliveryPartner = async (
    orderId
  ) => {
    const partnerId =
      selectedPartners[orderId];

    if (!partnerId) {
      setErrorMessage(
        "Please select a delivery partner first."
      );

      return;
    }

    const partner =
      deliveryPartners.find(
        (item) =>
          item.id === partnerId
      );

    if (!partner) {
      setErrorMessage(
        "Selected delivery partner was not found."
      );

      return;
    }

    try {
      setAssigningOrderId(orderId);
      setErrorMessage("");

      // -------------------------------------------------------
      // UPDATE ORDER
      // -------------------------------------------------------

      await updateDoc(
        doc(db, "orders", orderId),
        {
          deliveryPartnerId:
            partner.id,

          deliveryPartnerName:
            partner.name ||
            "Delivery Partner",

          deliveryPartnerPhone:
            partner.phone ||
            "",

          deliveryPartnerEmail:
            partner.email ||
            "",

          status:
            "Pickup Assigned",

          assignedAt:
            new Date(),

          assignedBy:
            adminUser?.uid || null,

          assignedByRole:
            "admin",

          updatedAt:
            new Date(),
        }
      );

      // -------------------------------------------------------
      // CLEAR SELECTED PARTNER
      // -------------------------------------------------------

      setSelectedPartners(
        (previous) => ({
          ...previous,
          [orderId]: "",
        })
      );

    } catch (error) {
      console.error(
        "Delivery partner assignment error:",
        error
      );

      setErrorMessage(
        "Unable to assign delivery partner. Please try again."
      );
    } finally {
      setAssigningOrderId(null);
    }
  };

  // =========================================================
  // ORDER STATISTICS
  // =========================================================

  const totalOrders =
    orders.length;

  const processingOrders =
    orders.filter((order) => {
      const status =
        String(
          order.status || ""
        )
          .toLowerCase()
          .trim();

      return (
        status === "processing" ||
        status === "order placed" ||
        status === "pickup scheduled"
      );
    }).length;

  const outForDeliveryOrders =
    orders.filter((order) => {
      const status =
        String(
          order.status || ""
        )
          .toLowerCase()
          .trim();

      return (
        status ===
          "out for delivery" ||
        status ===
          "out_for_delivery"
      );
    }).length;

  const deliveredOrders =
    orders.filter((order) => {
      const status =
        String(
          order.status || ""
        )
          .toLowerCase()
          .trim();

      return status === "delivered";
    }).length;

  // =========================================================
  // SORT RECENT ORDERS
  // =========================================================

  const recentOrders =
    [...orders]
      .sort((a, b) => {
        const aTime =
          a.createdAt?.seconds ||
          0;

        const bTime =
          b.createdAt?.seconds ||
          0;

        return bTime - aTime;
      })
      .slice(0, 8);

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (
    dateValue
  ) => {
    if (!dateValue) {
      return "Not available";
    }

    if (
      typeof dateValue ===
        "object" &&
      dateValue.seconds
    ) {
      return new Date(
        dateValue.seconds * 1000
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    }

    if (
      typeof dateValue ===
      "string"
    ) {
      const date =
        new Date(dateValue);

      if (
        !isNaN(
          date.getTime()
        )
      ) {
        return date.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );
      }
    }

    return "Not available";
  };

  // =========================================================
  // CLOTHING TOTAL
  // =========================================================

  const getTotalItems = (
    order
  ) => {
    const clothing =
      order.clothingItems ||
      {};

    return (
      Number(
        clothing.shirts || 0
      ) +
      Number(
        clothing.trousers || 0
      ) +
      Number(
        clothing.tShirts || 0
      ) +
      Number(
        clothing.dresses || 0
      ) +
      Number(
        clothing.other || 0
      )
    );
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (
    status
  ) => {
    const value =
      String(
        status || ""
      )
        .toLowerCase()
        .replace(
          /\s+/g,
          "-"
        );

    if (
      value ===
      "delivered"
    ) {
      return "admin-status delivered";
    }

    if (
      value ===
        "out-for-delivery" ||
      value ===
        "out_for_delivery"
    ) {
      return "admin-status delivery";
    }

    if (
      value === "ready"
    ) {
      return "admin-status ready";
    }

    if (
      value ===
      "pickup-assigned"
    ) {
      return "admin-status assigned";
    }

    if (
      value ===
      "picked-up"
    ) {
      return "admin-status picked";
    }

    return "admin-status processing";
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <>
        <style>
          {adminStyles}
        </style>

        <main className="admin-page">

          <div className="admin-loading">

            <RefreshCw
              size={30}
              className="admin-loading-icon"
            />

            <h3>
              Loading admin dashboard...
            </h3>

            <p>
              Connecting to Firebase
            </p>

          </div>

        </main>
      </>
    );
  }

  // =========================================================
  // SAFETY
  // =========================================================

  if (!adminUser) {
    return null;
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <>
      <style>
        {adminStyles}
      </style>

      <main className="admin-page">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="admin-hero">

          <div className="admin-hero-content">

            <div className="admin-label">

              <ShieldCheck
                size={15}
              />

              <span>
                RPS ADMINISTRATION
              </span>

            </div>

            <h1>
              Manage your
              <br />
              <span>
                business.
              </span>
            </h1>

            <p>
              Monitor customers, orders,
              delivery partners and service
              activity from one place.
            </p>

          </div>

          <div className="admin-live-badge">

            <span className="admin-live-dot"></span>

            Live Firebase Data

          </div>

        </section>


        {/* =================================================
            DASHBOARD CONTENT
        ================================================= */}

        <section className="admin-container">

          {/* =================================================
              ERROR
          ================================================= */}

          {errorMessage && (

            <div className="admin-error">

              <AlertCircle
                size={17}
              />

              <span>
                {errorMessage}
              </span>

            </div>

          )}


          {/* =================================================
              STATISTICS
          ================================================= */}

          <section className="admin-stats-grid">

            {/* CUSTOMERS */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                <Users size={22} />
              </div>

              <div>

                <span>
                  TOTAL CUSTOMERS
                </span>

                <strong>
                  {customers.length}
                </strong>

                <p>
                  Registered customers
                </p>

              </div>

            </div>


            {/* ORDERS */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                <Package size={22} />
              </div>

              <div>

                <span>
                  TOTAL ORDERS
                </span>

                <strong>
                  {totalOrders}
                </strong>

                <p>
                  All service orders
                </p>

              </div>

            </div>


            {/* PROCESSING */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                <Clock3 size={22} />
              </div>

              <div>

                <span>
                  PROCESSING
                </span>

                <strong>
                  {processingOrders}
                </strong>

                <p>
                  Currently being handled
                </p>

              </div>

            </div>


            {/* DELIVERY */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                <Truck size={22} />
              </div>

              <div>

                <span>
                  OUT FOR DELIVERY
                </span>

                <strong>
                  {outForDeliveryOrders}
                </strong>

                <p>
                  Currently on the way
                </p>

              </div>

            </div>


            {/* DELIVERED */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                <CheckCircle2
                  size={22}
                />
              </div>

              <div>

                <span>
                  DELIVERED
                </span>

                <strong>
                  {deliveredOrders}
                </strong>

                <p>
                  Successfully completed
                </p>

              </div>

            </div>

          </section>


          {/* =================================================
              DELIVERY PARTNER SUMMARY
          ================================================= */}

          <section className="admin-section">

            <div className="admin-section-heading">

              <div>

                <span>
                  DELIVERY TEAM
                </span>

                <h2>
                  Delivery Partners
                </h2>

              </div>

              <div className="admin-partner-count">

                <Truck size={15} />

                {deliveryPartners.length}{" "}

                {deliveryPartners.length ===
                1
                  ? "partner"
                  : "partners"}

              </div>

            </div>


            <div className="admin-partners-grid">

              {deliveryPartners.length ===
              0 ? (

                <div className="admin-no-partners">

                  <Truck
                    size={24}
                  />

                  <div>

                    <strong>
                      No delivery partners found
                    </strong>

                    <p>
                      Create a delivery partner
                      account in Firebase first.
                    </p>

                  </div>

                </div>

              ) : (

                deliveryPartners.map(
                  (partner) => (

                    <div
                      className="admin-partner-card"
                      key={partner.id}
                    >

                      <div className="admin-partner-icon">

                        <UserRound
                          size={20}
                        />

                      </div>

                      <div>

                        <strong>
                          {partner.name ||
                            "Delivery Partner"}
                        </strong>

                        <p>

                          <Phone
                            size={13}
                          />

                          {partner.phone ||
                            "Phone not added"}

                        </p>

                      </div>

                      <span
                        className={
                          partner.isActive ===
                          false
                            ? "partner-inactive"
                            : "partner-active"
                        }
                      >

                        {partner.isActive ===
                        false
                          ? "Inactive"
                          : "Active"}

                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </section>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="admin-section">

            <div className="admin-section-heading">

              <div>

                <span>
                  MANAGEMENT
                </span>

                <h2>
                  Quick actions
                </h2>

              </div>

            </div>


            <div className="admin-actions-grid">

              <button
                className="admin-action-card"
                onClick={() =>
                  navigate(
                    "/admin/orders"
                  )
                }
              >

                <div className="admin-action-icon">
                  <Package
                    size={23}
                  />
                </div>

                <div>

                  <h3>
                    Manage Orders
                  </h3>

                  <p>
                    View and manage every
                    customer order.
                  </p>

                </div>

                <ArrowRight
                  size={19}
                />

              </button>


              <button
                className="admin-action-card"
                onClick={() =>
                  navigate("/orders")
                }
              >

                <div className="admin-action-icon">
                  <ShoppingBag
                    size={23}
                  />
                </div>

                <div>

                  <h3>
                    Customer Orders
                  </h3>

                  <p>
                    Open the customer order
                    experience.
                  </p>

                </div>

                <ArrowRight
                  size={19}
                />

              </button>

            </div>

          </section>


          {/* =================================================
              RECENT ORDERS
          ================================================= */}

          <section className="admin-section">

            <div className="admin-section-heading">

              <div>

                <span>
                  ORDER ACTIVITY
                </span>

                <h2>
                  Recent Orders
                </h2>

              </div>

              <button
                className="admin-outline-button"
                onClick={() =>
                  navigate(
                    "/admin/orders"
                  )
                }
              >

                View All

                <ArrowRight
                  size={16}
                />

              </button>

            </div>


            {recentOrders.length ===
            0 ? (

              <div className="admin-empty">

                <div className="admin-empty-icon">

                  <Package
                    size={30}
                  />

                </div>

                <h3>
                  No orders yet
                </h3>

                <p>
                  Customer orders will appear
                  here once they are placed.
                </p>

              </div>

            ) : (

              <div className="admin-orders-list">

                {recentOrders.map(
                  (order) => {

                    const assignedPartner =
                      deliveryPartners.find(
                        (partner) =>
                          partner.id ===
                          order.deliveryPartnerId
                      );

                    const assignedName =
                      order.deliveryPartnerName ||
                      assignedPartner?.name ||
                      "";

                    const isAssigning =
                      assigningOrderId ===
                      order.id;

                    return (

                      <article
                        className="admin-order-card"
                        key={order.id}
                      >

                        {/* =================================
                            ORDER HEADER
                        ================================== */}

                        <div className="admin-order-top">

                          <div className="admin-order-icon">

                            <Package
                              size={21}
                            />

                          </div>


                          <div className="admin-order-main">

                            <span className="admin-order-number">

                              ORDER #

                              {order.id
                                .slice(
                                  0,
                                  8
                                )
                                .toUpperCase()}

                            </span>

                            <h3>

                              {order.customerName ||
                                "Customer"}

                            </h3>

                            <p>

                              {order.service ||
                                "Professional Ironing"}

                            </p>

                          </div>


                          <div
                            className={getStatusClass(
                              order.status
                            )}
                          >

                            <Clock3
                              size={14}
                            />

                            <span>

                              {order.status ||
                                "Processing"}

                            </span>

                          </div>

                        </div>


                        {/* =================================
                            ORDER INFO
                        ================================== */}

                        <div className="admin-order-info">

                          <div>

                            <Shirt
                              size={15}
                            />

                            <span>

                              {getTotalItems(
                                order
                              )}{" "}

                              {getTotalItems(
                                order
                              ) === 1
                                ? "item"
                                : "items"}

                            </span>

                          </div>


                          <div>

                            <CalendarDays
                              size={15}
                            />

                            <span>

                              {formatDate(
                                order.pickupDate
                              )}

                            </span>

                          </div>


                          <div>

                            <MapPin
                              size={15}
                            />

                            <span>

                              {order.pickupAddress ||
                                "Address not available"}

                            </span>

                          </div>

                        </div>


                        {/* =================================
                            DELIVERY ASSIGNMENT
                        ================================== */}

                        <div className="admin-assignment-box">

                          <div className="admin-assignment-heading">

                            <div className="admin-assignment-title">

                              <UserCheck
                                size={17}
                              />

                              <div>

                                <span>
                                  DELIVERY PARTNER
                                </span>

                                <strong>

                                  {assignedName
                                    ? `Assigned: ${assignedName}`
                                    : "Not assigned"}

                                </strong>

                              </div>

                            </div>


                            {assignedName && (

                              <span className="admin-assigned-badge">

                                <CheckCircle2
                                  size={13}
                                />

                                Assigned

                              </span>

                            )}

                          </div>


                          <div className="admin-assignment-controls">

                            <div className="admin-select-wrapper">

                              <UserRound
                                size={16}
                              />

                              <select
                                value={
                                  selectedPartners[
                                    order.id
                                  ] ||
                                  order.deliveryPartnerId ||
                                  ""
                                }
                                onChange={(event) =>
                                  setSelectedPartners(
                                    (previous) => ({
                                      ...previous,
                                      [order.id]:
                                        event
                                          .target
                                          .value,
                                    })
                                  )
                                  }
                              >

                                <option value="">
                                  Select Delivery Partner
                                </option>

                                {deliveryPartners.map(
                                  (partner) => (

                                    <option
                                      key={
                                        partner.id
                                      }
                                      value={
                                        partner.id
                                      }
                                      disabled={
                                        partner.isActive ===
                                        false
                                      }
                                    >

                                      {partner.name ||
                                        "Delivery Partner"}

                                      {partner.phone
                                        ? ` - ${partner.phone}`
                                        : ""}

                                      {partner.isActive ===
                                      false
                                        ? " (Inactive)"
                                        : ""}

                                    </option>

                                  )
                                )}

                              </select>

                              <ChevronDown
                                size={16}
                              />

                            </div>


                            <button
                              type="button"
                              className="admin-assign-button"
                              disabled={
                                isAssigning ||
                                deliveryPartners.length ===
                                  0 ||
                                !(
                                  selectedPartners[
                                    order.id
                                  ] ||
                                  order.deliveryPartnerId
                                )
                              }
                              onClick={() =>
                                assignDeliveryPartner(
                                  order.id
                                )
                              }
                            >

                              {isAssigning ? (
                                <>
                                  <RefreshCw
                                    size={15}
                                    className="admin-button-spin"
                                  />

                                  Assigning...
                                </>
                              ) : (

                                <>
                                  <UserCheck
                                    size={15}
                                  />

                                  {assignedName
                                    ? "Reassign Partner"
                                    : "Assign Partner"}
                                </>

                              )}

                            </button>

                          </div>


                          {assignedName && (
                            <p className="admin-assignment-note">

                              This order is assigned to{" "}

                              <strong>
                                {assignedName}
                              </strong>

                              . The delivery partner
                              dashboard will receive
                              this order automatically.

                            </p>
                          )}

                        </div>


                        {/* =================================
                            VIEW ORDER
                        ================================== */}

                        <div className="admin-order-footer">

                          <button
                            className="admin-view-button"
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

            )}

          </section>


          {/* =================================================
              SYSTEM STATUS
          ================================================= */}

          <section className="admin-system-card">

            <div className="admin-system-icon">

              <CheckCircle2
                size={22}
              />

            </div>

            <div>

              <span>
                SYSTEM STATUS
              </span>

              <h3>
                Firebase connected
              </h3>

              <p>
                Orders, customers and delivery
                partners are synchronized in
                real time.
              </p>

            </div>

            <div className="admin-system-status">

              <span></span>

              Online

            </div>

          </section>

        </section>

      </main>
    </>
  );
}


// ============================================================
// ADMIN DASHBOARD STYLES
// ============================================================

const adminStyles = `

.admin-page {
  min-height: 100vh;
  background: #faf9ff;
  color: #101322;
}


/* =========================================================
   HERO
========================================================= */

.admin-hero {
  position: relative;
  padding: 90px 7% 75px;

  background:
    radial-gradient(
      circle at 80% 20%,
      rgba(124, 58, 237, 0.13),
      transparent 35%
    ),
    #faf9ff;
}

.admin-hero-content {
  max-width: 850px;
  margin: 0 auto;
}

.admin-label {
  display: flex;
  align-items: center;
  gap: 8px;

  color: #7c3aed;

  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;

  margin-bottom: 22px;
}

.admin-hero h1 {
  margin: 0;

  font-size:
    clamp(48px, 6vw, 82px);

  line-height: 0.98;

  letter-spacing: -4px;
}

.admin-hero h1 span {
  color: #7c3aed;
}

.admin-hero p {
  max-width: 650px;

  margin-top: 28px;

  color: #667085;

  font-size: 17px;
  line-height: 1.7;
}

.admin-live-badge {
  position: absolute;

  right: 7%;
  bottom: 80px;

  display: flex;
  align-items: center;
  gap: 9px;

  padding: 10px 15px;

  border: 1px solid #ddd6fe;
  border-radius: 999px;

  background: #ffffff;

  color: #5b21b6;

  font-size: 13px;
  font-weight: 600;

  box-shadow:
    0 8px 30px
    rgba(124, 58, 237, 0.08);
}

.admin-live-dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #22c55e;

  box-shadow:
    0 0 0 4px #dcfce7;
}


/* =========================================================
   CONTAINER
========================================================= */

.admin-container {
  width: min(1100px, 86%);

  margin: 0 auto;

  padding-bottom: 100px;
}


/* =========================================================
   ERROR
========================================================= */

.admin-error {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 25px;

  padding: 15px 18px;

  border: 1px solid #fecaca;
  border-radius: 12px;

  background: #fff1f2;

  color: #b91c1c;

  font-size: 14px;
}


/* =========================================================
   STATS
========================================================= */

.admin-stats-grid {
  display: grid;

  grid-template-columns:
    repeat(5, 1fr);

  gap: 15px;
}

.admin-stat-card {
  display: flex;

  gap: 15px;

  align-items: flex-start;

  min-height: 145px;

  padding: 22px;

  border: 1px solid #e7def7;

  border-radius: 22px;

  background: #ffffff;

  box-shadow:
    0 15px 40px
    rgba(51, 26, 94, 0.05);
}

.admin-stat-icon {
  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 44px;
  height: 44px;

  border-radius: 14px;

  background: #f0e7ff;

  color: #7c3aed;
}

.admin-stat-card span {
  display: block;

  color: #85899a;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 1.2px;
}

.admin-stat-card strong {
  display: block;

  margin-top: 7px;

  font-size: 30px;
}

.admin-stat-card p {
  margin: 4px 0 0;

  color: #8a8fa1;

  font-size: 12px;

  line-height: 1.4;
}


/* =========================================================
   SECTION
========================================================= */

.admin-section {
  margin-top: 70px;
}

.admin-section-heading {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 25px;
}

.admin-section-heading span {
  color: #7c3aed;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 2px;
}

.admin-section-heading h2 {
  margin: 8px 0 0;

  font-size: 31px;

  letter-spacing: -1px;
}


/* =========================================================
   PARTNER COUNT
========================================================= */

.admin-partner-count {
  display: flex;

  align-items: center;

  gap: 7px;

  padding: 9px 13px;

  border: 1px solid #ddd6fe;

  border-radius: 999px;

  background: white;

  color: #6d28d9 !important;

  font-size: 12px !important;

  letter-spacing: 0 !important;
}


/* =========================================================
   PARTNERS
========================================================= */

.admin-partners-grid {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 14px;
}

.admin-partner-card {
  position: relative;

  display: flex;

  align-items: center;

  gap: 13px;

  padding: 17px;

  border: 1px solid #e7def7;

  border-radius: 17px;

  background: white;
}

.admin-partner-icon {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 45px;
  height: 45px;

  min-width: 45px;

  border-radius: 13px;

  background: #f0e7ff;

  color: #7c3aed;
}

.admin-partner-card > div:nth-child(2) {
  min-width: 0;
  flex: 1;
}

.admin-partner-card strong {
  display: block;

  color: #252131;

  font-size: 14px;
}

.admin-partner-card p {
  display: flex;

  align-items: center;

  gap: 5px;

  margin: 5px 0 0;

  color: #85899a;

  font-size: 11px;
}

.partner-active,
.partner-inactive {
  position: absolute;

  top: 12px;
  right: 12px;

  padding: 5px 8px;

  border-radius: 999px;

  font-size: 9px;

  font-weight: 700;
}

.partner-active {
  background: #dcfce7;
  color: #15803d;
}

.partner-inactive {
  background: #fee2e2;
  color: #b91c1c;
}

.admin-no-partners {
  grid-column: 1 / -1;

  display: flex;

  align-items: center;

  gap: 14px;

  padding: 22px;

  border: 1px dashed #cfc1e8;

  border-radius: 18px;

  background: #ffffff;

  color: #7c3aed;
}

.admin-no-partners strong {
  display: block;

  color: #282331;

  font-size: 14px;
}

.admin-no-partners p {
  margin: 5px 0 0;

  color: #85899a;

  font-size: 12px;
}


/* =========================================================
   QUICK ACTIONS
========================================================= */

.admin-actions-grid {
  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap: 18px;
}

.admin-action-card {
  display: flex;

  align-items: center;

  gap: 20px;

  padding: 25px;

  border: 1px solid #e7def7;

  border-radius: 22px;

  background: #ffffff;

  color: #101322;

  text-align: left;

  cursor: pointer;

  transition:
    0.25s ease;
}

.admin-action-card:hover {
  transform: translateY(-3px);

  border-color: #c4b5fd;

  box-shadow:
    0 18px 45px
    rgba(124, 58, 237, 0.1);
}

.admin-action-icon {
  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 52px;
  height: 52px;

  border-radius: 16px;

  background: #f0e7ff;

  color: #7c3aed;
}

.admin-action-card div:nth-child(2) {
  flex: 1;
}

.admin-action-card h3 {
  margin: 0 0 6px;

  font-size: 17px;
}

.admin-action-card p {
  margin: 0;

  color: #7b8193;

  font-size: 13px;

  line-height: 1.5;
}


/* =========================================================
   OUTLINE BUTTON
========================================================= */

.admin-outline-button {
  display: flex;

  align-items: center;

  gap: 7px;

  padding: 10px 15px;

  border: 1px solid #ddd6fe;

  border-radius: 10px;

  background: #ffffff;

  color: #6d28d9;

  font-weight: 600;

  cursor: pointer;
}


/* =========================================================
   ORDERS
========================================================= */

.admin-orders-list {
  display: flex;

  flex-direction: column;

  gap: 16px;
}

.admin-order-card {
  padding: 22px;

  border: 1px solid #e7def7;

  border-radius: 21px;

  background: #ffffff;

  box-shadow:
    0 10px 30px
    rgba(51, 26, 94, 0.035);
}


/* =========================================================
   ORDER TOP
========================================================= */

.admin-order-top {
  display: flex;

  align-items: center;

  gap: 15px;

  padding-bottom: 18px;

  border-bottom: 1px solid #eeeaf5;
}

.admin-order-icon {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 46px;
  height: 46px;

  min-width: 46px;

  border-radius: 14px;

  background: #f0e7ff;

  color: #7c3aed;
}

.admin-order-main {
  flex: 1;
}

.admin-order-number {
  display: block;

  color: #7c3aed;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 1px;
}

.admin-order-main h3 {
  margin: 5px 0 3px;

  font-size: 16px;
}

.admin-order-main p {
  margin: 0;

  color: #7d8395;

  font-size: 12px;
}


/* =========================================================
   STATUS
========================================================= */

.admin-status {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  padding: 8px 11px;

  border-radius: 999px;

  white-space: nowrap;

  font-size: 11px;

  font-weight: 700;
}

.admin-status.processing {
  background: #fff7ed;
  color: #ea580c;
}

.admin-status.assigned {
  background: #f0e7ff;
  color: #7c3aed;
}

.admin-status.picked {
  background: #eff6ff;
  color: #2563eb;
}

.admin-status.delivery {
  background: #eff6ff;
  color: #2563eb;
}

.admin-status.ready {
  background: #f0fdf4;
  color: #16a34a;
}

.admin-status.delivered {
  background: #dcfce7;
  color: #15803d;
}


/* =========================================================
   ORDER INFO
========================================================= */

.admin-order-info {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 10px;

  margin-top: 17px;
}

.admin-order-info div {
  display: flex;

  align-items: flex-start;

  gap: 7px;

  padding: 11px;

  border-radius: 11px;

  background: #faf8ff;

  color: #73798b;

  font-size: 11px;

  line-height: 1.45;
}

.admin-order-info svg {
  flex-shrink: 0;

  color: #7c3aed;
}


/* =========================================================
   ASSIGNMENT BOX
========================================================= */

.admin-assignment-box {
  margin-top: 16px;

  padding: 18px;

  border: 1px solid #ddd6fe;

  border-radius: 17px;

  background:
    linear-gradient(
      135deg,
      #faf8ff,
      #ffffff
    );
}

.admin-assignment-heading {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  margin-bottom: 14px;
}

.admin-assignment-title {
  display: flex;

  align-items: center;

  gap: 10px;

  color: #7c3aed;
}

.admin-assignment-title > div {
  display: flex;

  flex-direction: column;
}

.admin-assignment-title span {
  color: #8069b7;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 1.4px;
}

.admin-assignment-title strong {
  margin-top: 3px;

  color: #282331;

  font-size: 13px;
}

.admin-assigned-badge {
  display: inline-flex;

  align-items: center;

  gap: 5px;

  padding: 7px 10px;

  border-radius: 999px;

  background: #dcfce7;

  color: #15803d !important;

  font-size: 10px !important;

  font-weight: 700;

  letter-spacing: 0 !important;
}

.admin-assignment-controls {
  display: flex;

  align-items: stretch;

  gap: 9px;
}

.admin-select-wrapper {
  position: relative;

  display: flex;

  align-items: center;

  flex: 1;

  min-width: 0;

  color: #7c3aed;
}

.admin-select-wrapper > svg:first-child {
  position: absolute;

  left: 13px;

  pointer-events: none;
}

.admin-select-wrapper > svg:last-child {
  position: absolute;

  right: 12px;

  pointer-events: none;
}

.admin-select-wrapper select {
  width: 100%;

  min-height: 43px;

  padding:
    0 38px
    0 39px;

  border: 1px solid #ddd6fe;

  border-radius: 11px;

  outline: none;

  background: #ffffff;

  color: #3d3748;

  font-size: 12px;

  cursor: pointer;

  appearance: none;
}

.admin-select-wrapper select:focus {
  border-color: #9b7ae8;

  box-shadow:
    0 0 0 3px
    rgba(124, 58, 237, 0.08);
}

.admin-assign-button {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  min-width: 145px;

  padding: 0 15px;

  border: none;

  border-radius: 11px;

  background: #7c3aed;

  color: #ffffff;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;

  transition:
    0.2s ease;
}

.admin-assign-button:hover:not(:disabled) {
  background: #6d28d9;
}

.admin-assign-button:disabled {
  opacity: 0.45;

  cursor: not-allowed;
}

.admin-assignment-note {
  margin: 11px 0 0;

  color: #7d8395;

  font-size: 11px;

  line-height: 1.5;
}

.admin-assignment-note strong {
  color: #6d28d9;
}


/* =========================================================
   FOOTER
========================================================= */

.admin-order-footer {
  display: flex;

  justify-content: flex-end;

  margin-top: 16px;

  padding-top: 15px;

  border-top: 1px solid #eeeaf5;
}

.admin-view-button {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  padding: 10px 14px;

  border: 1px solid #ddd6fe;

  border-radius: 10px;

  background: #ffffff;

  color: #6d28d9;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;
}

.admin-view-button:hover {
  background: #f5f0ff;
}


/* =========================================================
   EMPTY
========================================================= */

.admin-empty {
  padding: 70px 30px;

  border: 1px solid #e7def7;

  border-radius: 24px;

  background: #ffffff;

  text-align: center;
}

.admin-empty-icon {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 62px;
  height: 62px;

  margin: 0 auto 18px;

  border-radius: 18px;

  background: #f0e7ff;

  color: #7c3aed;
}

.admin-empty h3 {
  margin: 0;

  font-size: 20px;
}

.admin-empty p {
  margin: 10px 0 0;

  color: #7d8395;
}


/* =========================================================
   SYSTEM
========================================================= */

.admin-system-card {
  display: flex;

  align-items: center;

  gap: 18px;

  margin-top: 70px;

  padding: 24px;

  border: 1px solid #ddd6fe;

  border-radius: 22px;

  background:
    linear-gradient(
      135deg,
      #ffffff,
      #faf7ff
    );
}

.admin-system-icon {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;

  border-radius: 15px;

  background: #dcfce7;

  color: #16a34a;
}

.admin-system-card > div:nth-child(2) {
  flex: 1;
}

.admin-system-card span {
  display: block;

  color: #7c3aed;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 1.5px;
}

.admin-system-card h3 {
  margin: 5px 0;

  font-size: 17px;
}

.admin-system-card p {
  margin: 0;

  color: #7d8395;

  font-size: 12px;
}

.admin-system-status {
  display: flex;

  align-items: center;

  gap: 8px;

  color: #16a34a;

  font-size: 13px;

  font-weight: 700;
}

.admin-system-status span {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #22c55e;
}


/* =========================================================
   LOADING
========================================================= */

.admin-loading {
  min-height: 70vh;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;
}

.admin-loading-icon {
  color: #7c3aed;

  animation:
    admin-spin
    1s linear infinite;
}

.admin-loading h3 {
  margin: 20px 0 5px;
}

.admin-loading p {
  margin: 0;

  color: #7d8395;
}


/* =========================================================
   SPIN
========================================================= */

.admin-button-spin {
  animation:
    admin-spin
    0.8s linear infinite;
}

@keyframes admin-spin {
  to {
    transform: rotate(360deg);
  }
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 1100px) {

  .admin-stats-grid {
    grid-template-columns:
      repeat(3, 1fr);
  }

  .admin-partners-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 750px) {

  .admin-hero {
    padding:
      60px 7%
      110px;
  }

  .admin-live-badge {
    left: 7%;

    right: auto;

    bottom: 45px;
  }

  .admin-stats-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .admin-actions-grid {
    grid-template-columns: 1fr;
  }

  .admin-partners-grid {
    grid-template-columns: 1fr;
  }

  .admin-order-top {
    align-items: flex-start;

    flex-wrap: wrap;
  }

  .admin-status {
    margin-left: 61px;
  }

  .admin-order-info {
    grid-template-columns: 1fr;
  }

  .admin-assignment-controls {
    flex-direction: column;
  }

  .admin-assign-button {
    min-height: 43px;
  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 500px) {

  .admin-container {
    width: 92%;
  }

  .admin-stats-grid {
    grid-template-columns: 1fr;
  }

  .admin-hero h1 {
    letter-spacing: -2px;
  }

  .admin-section-heading {
    align-items: flex-start;

    flex-direction: column;
  }

  .admin-assignment-heading {
    align-items: flex-start;

    flex-direction: column;
  }

  .admin-assigned-badge {
    align-self: flex-start;
  }

  .admin-system-card {
    align-items: flex-start;

    flex-wrap: wrap;
  }

  .admin-system-status {
    width: 100%;

    margin-left: 66px;
  }

}`;