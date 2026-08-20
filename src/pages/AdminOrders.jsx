import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  ArrowLeft,
  Search,
  Filter,
  X,
  Package,
  Users,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Clock3,
  Shirt,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  LoaderCircle,
  Calendar,
  MoreVertical,
} from "lucide-react";

import { db } from "../config/firebase";
import "./AdminOrders.css";

const STATUS_OPTIONS = [
  "All Statuses",
  "Processing",
  "Pickup Assigned",
  "Picked Up",
  "Ready",
  "Out for Delivery",
  "Delivered",
];

const normalizeStatus = (status) => {
  if (!status) return "Processing";

  const value = String(status)
    .toLowerCase()
    .replace(/_/g, " ")
    .trim();

  const map = {
    processing: "Processing",
    "pickup assigned": "Pickup Assigned",
    picked: "Picked Up",
    "picked up": "Picked Up",
    ready: "Ready",
    "out for delivery": "Out for Delivery",
    delivered: "Delivered",
  };

  return map[value] || "Processing";
};

const formatDate = (value) => {
  if (!value) return "—";

  try {
    let date;

    if (value?.toDate) {
      date = value.toDate();
    } else if (value?.seconds) {
      date = new Date(value.seconds * 1000);
    } else {
      date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const formatDateTime = (value) => {
  if (!value) return "—";

  try {
    let date;

    if (value?.toDate) {
      date = value.toDate();
    } else if (value?.seconds) {
      date = new Date(value.seconds * 1000);
    } else {
      date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

const getDateValue = (value) => {
  if (!value) return null;

  if (value?.toDate) return value.toDate();

  if (value?.seconds) {
    return new Date(value.seconds * 1000);
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const getClothingItems = (order) => {
  const items = order?.clothingItems;

  if (items && typeof items === "object" && !Array.isArray(items)) {
    return {
      shirts: Number(items.shirts || 0),
      tshirts: Number(
        items.tshirts ||
          items.tShirts ||
          items["T-Shirts"] ||
          0
      ),
      trousers: Number(items.trousers || 0),
      dresses: Number(items.dresses || 0),
      other: Number(items.other || 0),
    };
  }

  return {
    shirts: Number(order?.shirts || 0),
    tshirts: Number(
      order?.tshirts ||
        order?.tShirts ||
        0
    ),
    trousers: Number(order?.trousers || 0),
    dresses: Number(order?.dresses || 0),
    other: Number(order?.other || 0),
  };
};

const getTotalItems = (order) => {
  const items = getClothingItems(order);

  const calculated =
    items.shirts +
    items.tshirts +
    items.trousers +
    items.dresses +
    items.other;

  return calculated || Number(order?.totalItems || order?.itemCount || 0);
};

const getCustomerName = (order) =>
  order?.customerName ||
  order?.name ||
  order?.customer?.name ||
  "Unknown Customer";

const getCustomerEmail = (order) =>
  order?.customerEmail ||
  order?.email ||
  order?.customer?.email ||
  "—";

const getCustomerPhone = (order) =>
  order?.customerPhone ||
  order?.phone ||
  order?.customer?.phone ||
  "—";

const getPickupAddress = (order) =>
  order?.pickupAddress ||
  order?.address ||
  order?.pickup?.address ||
  "—";

const getPickupDate = (order) =>
  order?.pickupDate ||
  order?.pickup?.date ||
  null;

const getPickupTime = (order) =>
  order?.pickupTime ||
  order?.pickup?.time ||
  "10:00 AM - 12:00 PM";

const getOrderService = (order) =>
  order?.serviceName ||
  order?.service ||
  order?.serviceType ||
  "Professional Ironing";

const getAmount = (order) =>
  order?.totalAmount ??
  order?.amount ??
  order?.total ??
  0;

const getPaymentStatus = (order) =>
  order?.paymentStatus ||
  order?.payment?.status ||
  "Paid";

const getPaymentMethod = (order) =>
  order?.paymentMethod ||
  order?.payment?.method ||
  "COD";

const getStatusClass = (status) => {
  return String(status)
    .toLowerCase()
    .replace(/\s+/g, "-");
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All Statuses");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [page, setPage] = useState(1);

  const ORDERS_PER_PAGE = 5;

  useEffect(() => {
    const ordersRef = collection(db, "orders");

    const ordersQuery = query(
      ordersRef,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setOrders(data);
        setLoading(false);
      },
      (error) => {
        console.error("Orders listener error:", error);

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredOrders = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return orders.filter((order) => {
      const status = normalizeStatus(order.status);

      const matchesStatus =
        statusFilter === "All Statuses" ||
        status === statusFilter;

      if (!matchesStatus) return false;

      if (!searchValue) return true;

      const searchableText = [
        order.id,
        order.orderId,
        getCustomerName(order),
        getCustomerEmail(order),
        getCustomerPhone(order),
        getPickupAddress(order),
        getOrderService(order),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchValue);
    });
  }, [orders, search, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ORDERS_PER_PAGE)
  );

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  const totalOrders = orders.length;

  const deliveredOrders = orders.filter(
    (order) =>
      normalizeStatus(order.status) === "Delivered"
  ).length;

  const activeOrders = orders.filter(
    (order) =>
      normalizeStatus(order.status) !== "Delivered"
  ).length;

  const todaysOrders = orders.filter((order) => {
    const date = getDateValue(
      order.createdAt || order.created_at
    );

    if (!date) return false;

    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }).length;

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Status update failed. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All Statuses");
  };

  if (loading) {
    return (
      <div className="admin-orders-loading-page">
        <LoaderCircle
          size={34}
          className="admin-orders-loader"
        />

        <h3>Loading orders...</h3>

        <p>
          Firebase se latest order data load ho raha hai.
        </p>
      </div>
    );
  }

  return (
    <main className="admin-orders-page">
      <div className="admin-orders-container">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="admin-orders-top">

          <button
            className="admin-orders-back"
            onClick={() =>
              (window.location.href = "/admin")
            }
          >
            <ArrowLeft size={16} />
            Back to Admin Dashboard
          </button>

          <div className="admin-orders-hero">

            <div className="admin-orders-hero-content">

              <span className="admin-orders-eyebrow">
                ORDER MANAGEMENT
              </span>

              <h1>
                Manage{" "}
                <strong>customer orders.</strong>
              </h1>

              <p>
                View, search and manage all customer
                service orders in real time.
              </p>

            </div>

            <div className="admin-orders-hero-visual">
              <div className="admin-orders-clothes-art">
                <div className="art-shirt"></div>
                <div className="art-fold art-one"></div>
                <div className="art-fold art-two"></div>
                <div className="art-fold art-three"></div>
                <div className="art-fold art-four"></div>
              </div>

              <div className="admin-orders-live-pill">
                <i></i>
                Live
              </div>
            </div>

          </div>
        </section>


        {/* =====================================================
            SUMMARY
        ===================================================== */}

        <section className="admin-orders-stats">

          <div className="admin-stat-card">
            <div className="admin-stat-icon purple">
              <Package size={20} />
            </div>

            <div>
              <span>Total Orders</span>
              <strong>{totalOrders}</strong>
              <small>All time</small>
            </div>
          </div>


          <div className="admin-stat-card">
            <div className="admin-stat-icon blue">
              <LoaderCircle size={20} />
            </div>

            <div>
              <span>Pending / Processing</span>
              <strong>{activeOrders}</strong>
              <small>Active orders</small>
            </div>
          </div>


          <div className="admin-stat-card">
            <div className="admin-stat-icon green">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Delivered</span>
              <strong>{deliveredOrders}</strong>
              <small>Completed orders</small>
            </div>
          </div>


          <div className="admin-stat-card">
            <div className="admin-stat-icon lavender">
              <Calendar size={20} />
            </div>

            <div>
              <span>Today's Orders</span>
              <strong>{todaysOrders}</strong>
              <small>
                {new Date().toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </small>
            </div>
          </div>

        </section>


        {/* =====================================================
            SEARCH / FILTER
        ===================================================== */}

        <section className="admin-orders-controls">

          <div className="admin-search-box">

            <Search size={19} />

            <input
              type="text"
              placeholder="Search by order ID, customer name, email, phone..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}

          </div>


          <div className="admin-filter-box">

            <Filter size={17} />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              {STATUS_OPTIONS.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

            <ChevronDown size={16} />

          </div>


          <button
            className="admin-clear-filter"
            onClick={clearFilters}
          >
            <X size={17} />
            Clear Filters
          </button>

        </section>


        {/* =====================================================
            RESULTS BAR
        ===================================================== */}

        <div className="admin-orders-results">

          <strong>
            {filteredOrders.length}{" "}
            {filteredOrders.length === 1
              ? "Order"
              : "Orders"}{" "}
            Found
          </strong>

          <div className="admin-sort">

            <span>Sort by:</span>

            <select defaultValue="latest">
              <option value="latest">
                Latest First
              </option>

              <option value="oldest">
                Oldest First
              </option>
            </select>

          </div>

        </div>


        {/* =====================================================
            ORDER LIST
        ===================================================== */}

        {paginatedOrders.length === 0 ? (

          <div className="admin-orders-empty">

            <div className="admin-empty-icon">
              <Package size={30} />
            </div>

            <h2>No orders found</h2>

            <p>
              Search ya filters change karke
              dobara try karein.
            </p>

            <button onClick={clearFilters}>
              Clear Filters
            </button>

          </div>

        ) : (

          <section className="admin-orders-list">

            {paginatedOrders.map((order) => {

              const status =
                normalizeStatus(order.status);

              const clothing =
                getClothingItems(order);

              const totalItems =
                getTotalItems(order);

              const orderNumber =
                order.orderId ||
                order.id;

              const createdAt =
                order.createdAt ||
                order.created_at;

              const updatedAt =
                order.updatedAt ||
                order.updated_at;

              return (

                <article
                  className="admin-order-card"
                  key={order.id}
                >

                  {/* ORDER MAIN */}

                  <div className="admin-order-main">

                    {/* LEFT */}

                    <div className="admin-order-primary">

                      <div className="admin-order-icon">
                        <Package size={24} />
                      </div>

                      <div>

                        <span className="admin-order-id">
                          ORDER ID
                        </span>

                        <h2>
                          #{String(orderNumber).slice(-10)}
                        </h2>

                        <h3>
                          {getOrderService(order)}
                        </h3>

                        <span className="admin-items-count">
                          {totalItems}{" "}
                          {totalItems === 1
                            ? "Item"
                            : "Items"}
                        </span>

                      </div>

                    </div>


                    {/* CUSTOMER */}

                    <div className="admin-order-info">

                      <div className="admin-info-block">

                        <span>
                          <Users size={14} />
                          Customer
                        </span>

                        <strong>
                          {getCustomerName(order)}
                        </strong>

                      </div>


                      <div className="admin-info-block">

                        <span>
                          <Mail size={14} />
                          Email
                        </span>

                        <strong>
                          {getCustomerEmail(order)}
                        </strong>

                      </div>


                      <div className="admin-info-block">

                        <span>
                          <Phone size={14} />
                          Phone
                        </span>

                        <strong>
                          {getCustomerPhone(order)}
                        </strong>

                      </div>


                      <div className="admin-info-block">

                        <span>
                          <MapPin size={14} />
                          Pickup Address
                        </span>

                        <strong>
                          {getPickupAddress(order)}
                        </strong>

                      </div>

                    </div>


                    {/* PICKUP */}

                    <div className="admin-order-pickup">

                      <div className="admin-info-block">

                        <span>
                          <CalendarDays size={14} />
                          Pickup Date
                        </span>

                        <strong>
                          {formatDate(
                            getPickupDate(order)
                          )}
                        </strong>

                      </div>


                      <div className="admin-info-block">

                        <span>
                          <Clock3 size={14} />
                          Pickup Time
                        </span>

                        <strong>
                          {getPickupTime(order)}
                        </strong>

                      </div>

                    </div>


                    {/* CLOTHING */}

                    <div className="admin-clothing-section">

                      <div className="admin-clothing-title">

                        <Shirt size={19} />

                        <strong>
                          Clothing Items
                        </strong>

                      </div>


                      <div className="admin-clothing-items">

                        <div>
                          <span>Shirts</span>
                          <strong>
                            {clothing.shirts}
                          </strong>
                        </div>

                        <div>
                          <span>T-Shirts</span>
                          <strong>
                            {clothing.tshirts}
                          </strong>
                        </div>

                        <div>
                          <span>Trousers</span>
                          <strong>
                            {clothing.trousers}
                          </strong>
                        </div>

                        <div>
                          <span>Dresses</span>
                          <strong>
                            {clothing.dresses}
                          </strong>
                        </div>

                        <div>
                          <span>Other</span>
                          <strong>
                            {clothing.other}
                          </strong>
                        </div>

                      </div>

                    </div>

                  </div>


                  {/* BOTTOM */}

                  <div className="admin-order-bottom">

                    <div className="admin-bottom-info">

                      <div>
                        <span>Amount</span>

                        <strong>
                          ₹
                          {Number(
                            getAmount(order)
                          ).toFixed(2)}
                        </strong>
                      </div>


                      <div>
                        <span>Payment Status</span>

                        <strong className="payment-paid">
                          {getPaymentStatus(order)}
                        </strong>
                      </div>


                      <div>
                        <span>Payment Method</span>

                        <strong>
                          {getPaymentMethod(order)}
                        </strong>
                      </div>


                      <div>
                        <span>Created At</span>

                        <strong>
                          {formatDateTime(createdAt)}
                        </strong>
                      </div>


                      <div>
                        <span>Updated At</span>

                        <strong>
                          {formatDateTime(updatedAt)}
                        </strong>
                      </div>

                    </div>


                    <div className="admin-order-actions">

                      {/* STATUS */}

                      <div
                        className={`admin-status-select ${getStatusClass(
                          status
                        )}`}
                      >

                        {updatingId === order.id ? (
                          <LoaderCircle
                            size={15}
                            className="status-loader"
                          />
                        ) : (
                          <span className="status-dot"></span>
                        )}

                        <select
                          value={status}
                          disabled={
                            updatingId === order.id
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value
                            )
                          }
                        >
                          {STATUS_OPTIONS
                            .filter(
                              (item) =>
                                item !==
                                "All Statuses"
                            )
                            .map((item) => (
                              <option
                                key={item}
                                value={item}
                              >
                                {item}
                              </option>
                            ))}
                        </select>

                        <ChevronDown size={15} />

                      </div>


                      {/* VIEW */}

                      <button
                        className="admin-view-order"
                        onClick={() =>
                          alert(
                            `Order #${orderNumber}\n\nCustomer: ${getCustomerName(
                              order
                            )}\nService: ${getOrderService(
                              order
                            )}\nStatus: ${status}`
                          )
                        }
                      >
                        <Eye size={17} />
                        View Order
                      </button>


                      <button
                        className="admin-more-button"
                        title="More options"
                      >
                        <MoreVertical size={18} />
                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

          </section>
        )}


        {/* =====================================================
            PAGINATION
        ===================================================== */}

        {filteredOrders.length > 0 && (

          <div className="admin-pagination">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1)
                )
              }
            >
              <ChevronLeft size={17} />
            </button>


            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((number) => (

              <button
                key={number}
                className={
                  page === number
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPage(number)
                }
              >
                {number}
              </button>

            ))}


            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    totalPages,
                    current + 1
                  )
                )
              }
            >
              <ChevronRight size={17} />
            </button>

          </div>
        )}

      </div>
    </main>
  );
}