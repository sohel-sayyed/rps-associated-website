import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import {
  ShieldCheck,
  Users,
  Package,
  Clock3,
  Truck,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { auth, db } from "../config/firebase";

import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // =========================================================
  // ADMIN AUTHENTICATION + FIREBASE DATA
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          if (isMounted) {
            setLoading(false);

            navigate("/login", {
              replace: true,
            });
          }

          return;
        }

        try {
          // ===================================================
          // CHECK USER ROLE
          // ===================================================

          const userRef = doc(
            db,
            "users",
            currentUser.uid
          );

          const userSnapshot =
            await getDoc(userRef);

          if (!userSnapshot.exists()) {
            if (isMounted) {
              setLoading(false);

              navigate("/dashboard", {
                replace: true,
              });
            }

            return;
          }

          const userData =
            userSnapshot.data();

          // ===================================================
          // CUSTOMER CANNOT ACCESS ADMIN
          // ===================================================

          if (userData.role !== "admin") {
            if (isMounted) {
              setLoading(false);

              navigate("/dashboard", {
                replace: true,
              });
            }

            return;
          }

          // ===================================================
          // ADMIN VERIFIED
          // ===================================================

          if (isMounted) {
            setAdmin({
              uid: currentUser.uid,

              email:
                currentUser.email ||
                userData.email ||
                "",

              name:
                userData.name ||
                "RPS Admin",

              role: userData.role,
            });
          }

          // ===================================================
          // LOAD CUSTOMERS
          // ===================================================

          const customersSnapshot =
            await getDocs(
              collection(
                db,
                "customers"
              )
            );

          const customerData =
            customersSnapshot.docs.map(
              (customerDoc) => ({
                id: customerDoc.id,
                ...customerDoc.data(),
              })
            );

          // ===================================================
          // LOAD ORDERS
          // ===================================================

          let orderData = [];

          try {
            const ordersQuery = query(
              collection(
                db,
                "orders"
              ),

              orderBy(
                "createdAt",
                "desc"
              ),

              limit(50)
            );

            const ordersSnapshot =
              await getDocs(
                ordersQuery
              );

            orderData =
              ordersSnapshot.docs.map(
                (orderDoc) => ({
                  id: orderDoc.id,
                  ...orderDoc.data(),
                })
              );

          } catch (orderError) {
            console.error(
              "Unable to load orders:",
              orderError
            );

            // =================================================
            // FALLBACK WITHOUT ORDER BY
            // =================================================

            const fallbackSnapshot =
              await getDocs(
                collection(
                  db,
                  "orders"
                )
              );

            orderData =
              fallbackSnapshot.docs.map(
                (orderDoc) => ({
                  id: orderDoc.id,
                  ...orderDoc.data(),
                })
              );

            orderData.sort(
              (a, b) => {
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
              }
            );

            orderData =
              orderData.slice(0, 50);
          }

          if (isMounted) {
            setCustomers(
              customerData
            );

            setOrders(
              orderData
            );
          }

        } catch (error) {
          console.error(
            "Admin dashboard error:",
            error
          );

          if (isMounted) {
            setErrorMessage(
              "Unable to load admin data from Firebase."
            );
          }

        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigate]);


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await signOut(auth);

      localStorage.removeItem(
        "rpsCustomer"
      );

      navigate("/login", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Admin logout error:",
        error
      );

      setErrorMessage(
        "Unable to logout. Please try again."
      );

      setIsLoggingOut(false);
    }
  };


  // =========================================================
  // ORDER STATUS HELPERS
  // =========================================================

  const getStatus = (order) => {
    return String(
      order?.status ||
      "Processing"
    )
      .trim()
      .toLowerCase();
  };


  const processingOrders =
    orders.filter((order) => {
      const status =
        getStatus(order);

      return (
        status === "processing" ||
        status === "in progress" ||
        status === "ready"
      );
    }).length;


  const outForDelivery =
    orders.filter((order) => {
      const status =
        getStatus(order);

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
        getStatus(order);

      return (
        status === "delivered" ||
        status === "completed" ||
        status === "complete"
      );
    }).length;


  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <main className="dashboard-page">

        <div className="dashboard-loading">

          <Loader2
            size={34}
            className="dashboard-loader"
          />

          <p>
            Loading RPS administration...
          </p>

        </div>

      </main>
    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (
    errorMessage &&
    !admin
  ) {
    return (
      <main className="dashboard-page">

        <div className="dashboard-container">

          <div className="dashboard-error">

            <AlertCircle
              size={20}
            />

            <span>
              {errorMessage}
            </span>

          </div>

        </div>

      </main>
    );
  }


  // =========================================================
  // ADMIN DASHBOARD
  // =========================================================

  if (!admin) {
    return null;
  }


  return (
    <main className="dashboard-page">

      {/* =====================================================
          ADMIN HERO
          ===================================================== */}

      <section className="dashboard-hero">

        <div className="dashboard-hero-content">

          <div className="dashboard-label">

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
            Monitor customers, orders and
            service activity from one place.
          </p>

        </div>


        {/* FIREBASE STATUS */}

        <div className="dashboard-firebase-status">

          <span className="firebase-dot"></span>

          <span>
            Live Firebase Data
          </span>

        </div>

      </section>


      {/* =====================================================
          ADMIN CONTENT
          ===================================================== */}

      <section className="dashboard-container">

        {/* ===================================================
            ERROR MESSAGE
            =================================================== */}

        {errorMessage && (
          <div className="dashboard-error">

            <AlertCircle
              size={18}
            />

            <span>
              {errorMessage}
            </span>

          </div>
        )}


        {/* ===================================================
            ADMIN INFO
            =================================================== */}

        <div className="admin-account-card">

          <div className="admin-account-icon">

            <ShieldCheck
              size={25}
            />

          </div>


          <div className="admin-account-info">

            <span>
              ADMIN ACCOUNT
            </span>

            <h2>
              {admin.name}
            </h2>

            <p>
              {admin.email}
            </p>

          </div>


          <div className="admin-account-badge">

            <CheckCircle2
              size={15}
            />

            <span>
              Admin
            </span>

          </div>

        </div>


        {/* ===================================================
            STATISTICS
            =================================================== */}

        <div className="admin-stats-grid">

          {/* TOTAL CUSTOMERS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">

              <Users
                size={22}
              />

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


          {/* TOTAL ORDERS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">

              <Package
                size={22}
              />

            </div>


            <div>

              <span>
                TOTAL ORDERS
              </span>

              <strong>
                {orders.length}
              </strong>

              <p>
                All service orders
              </p>

            </div>

          </div>


          {/* PROCESSING */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">

              <Clock3
                size={22}
              />

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


          {/* OUT FOR DELIVERY */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">

              <Truck
                size={22}
              />

            </div>


            <div>

              <span>
                OUT FOR DELIVERY
              </span>

              <strong>
                {outForDelivery}
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

        </div>


        {/* ===================================================
            QUICK ACTIONS
            =================================================== */}

        <div className="dashboard-section-heading">

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

          {/* =================================================
              MANAGE ORDERS
              ================================================= */}

          <button
            type="button"
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
              size={20}
            />

          </button>


          {/* =================================================
              CUSTOMER ORDERS
              ================================================= */}

          <button
            type="button"
            className="admin-action-card"
            onClick={() =>
              navigate(
                "/admin/orders"
              )
            }
          >

            <div className="admin-action-icon">

              <Users
                size={23}
              />

            </div>


            <div>

              <h3>
                Customer Orders
              </h3>

              <p>
                Open and manage customer
                order activity.
              </p>

            </div>


            <ArrowRight
              size={20}
            />

          </button>

        </div>


        {/* ===================================================
            RECENT ORDERS
            =================================================== */}

        <section className="admin-orders-section">

          <div className="dashboard-section-heading">

            <div>

              <span>
                ORDER ACTIVITY
              </span>

              <h2>
                Recent Orders
              </h2>

            </div>


            {orders.length > 0 && (
              <button
                type="button"
                className="admin-view-all"
                onClick={() =>
                  navigate(
                    "/admin/orders"
                  )
                }
              >

                View All

                <ArrowRight
                  size={17}
                />

              </button>
            )}

          </div>


          {orders.length === 0 ? (

            <div className="admin-empty-orders">

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

              {orders
                .slice(0, 5)
                .map(
                  (order) => {

                    const status =
                      order.status ||
                      "Processing";

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


                    return (
                      <div
                        className="admin-order-card"
                        key={
                          order.id
                        }
                      >

                        <div className="admin-order-icon">

                          <Package
                            size={21}
                          />

                        </div>


                        <div className="admin-order-info">

                          <span>

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


                          <p>
                            {totalItems}{" "}
                            {totalItems ===
                            1
                              ? "item"
                              : "items"}
                          </p>

                        </div>


                        <div className="admin-order-status">

                          <Clock3
                            size={15}
                          />

                          <span>
                            {status}
                          </span>

                        </div>


                        <button
                          type="button"
                          className="admin-order-arrow"
                          onClick={() =>
                            navigate(
                              "/admin/orders"
                            )
                          }
                        >

                          <ArrowRight
                            size={18}
                          />

                        </button>

                      </div>
                    );
                  }
                )}

            </div>

          )}

        </section>


        {/* ===================================================
            FIREBASE STATUS
            =================================================== */}

        <div className="admin-system-status">

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
              Orders and customer data are
              being synchronized in real time.
            </p>

          </div>


          <div className="admin-online-status">

            <span className="firebase-dot"></span>

            <strong>
              Online
            </strong>

          </div>

        </div>


        {/* ===================================================
            ADMIN LOGOUT
            =================================================== */}

        <div className="admin-footer-actions">

          <button
            type="button"
            className="admin-logout-button"
            onClick={
              handleLogout
            }
            disabled={
              isLoggingOut
            }
          >

            {isLoggingOut ? (
              <>

                <Loader2
                  size={17}
                  className="dashboard-loader"
                />

                Logging out...

              </>
            ) : (
              <>

                <LogOut
                  size={17}
                />

                Logout Admin

              </>
            )}

          </button>

        </div>

      </section>

    </main>
  );
}