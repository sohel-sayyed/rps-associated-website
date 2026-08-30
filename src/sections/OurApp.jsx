import { motion } from "framer-motion";

import {
  Smartphone,
  CalendarCheck,
  PackageCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Apple,
  Download,
} from "lucide-react";


// ============================================================
// FEATURES
// ============================================================

const features = [
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    text: "Book professional ironing service in just a few taps.",
  },
  {
    icon: PackageCheck,
    title: "Order Tracking",
    text: "Track your ironing order from pickup to delivery.",
  },
  {
    icon: Truck,
    title: "Doorstep Pickup",
    text: "Schedule convenient pickup and delivery from your home.",
  },
];


// ============================================================
// PHONE SCREEN
// ============================================================

function PhoneScreen({ ios = false }) {
  return (
    <div className="app-phone">

      {/* PHONE HARDWARE NOTCH */}
{ios ? (
  <div className="ios-dynamic-island">
    <span className="ios-island-camera" />
  </div>
) : (
  <div className="android-punch-hole" />
)}

      {/* PHONE STATUS BAR */}
      <div className="phone-status-bar">
        <span>9:41</span>

        <span>
          ● ▰
        </span>
      </div>


      {/* PHONE HEADER */}
      <div className="app-phone-header">

        <div className="phone-welcome">
          <span>Welcome back</span>

          <strong>
            RPS Associated
          </strong>
        </div>

        <div className="app-phone-avatar">
          R
        </div>

      </div>


      {/* PHONE BODY */}
      <div className="app-phone-body">

        <span className="app-small-text">
          Need fresh clothes?
        </span>

        <h3>
          Book a service
        </h3>


        {/* SERVICE CARDS */}
        <div className="app-service-grid">

          <div className="app-service-card app-service-card-active">

            <div className="app-service-icon">
              <CalendarCheck size={17} />
            </div>

            <strong>
              Ironing
            </strong>

            <span>
              Professional finish
            </span>

          </div>


          <div className="app-service-card">

            <div className="app-service-icon">
              <PackageCheck size={17} />
            </div>

            <strong>
              My Orders
            </strong>

            <span>
              Track your clothes
            </span>

          </div>

        </div>


        {/* CURRENT ORDER */}
        <div className="phone-order-card">

          <div className="phone-order-top">

            <div>
              <span>
                Current order
              </span>

              <strong>
                #RP245689
              </strong>
            </div>

            <div className="phone-order-check">
              <CheckCircle2 size={15} />
            </div>

          </div>


          <h4>
            Ready for delivery
          </h4>

          <span>
            Arriving today
          </span>


          {/* ORDER PROGRESS */}
          <div className="phone-progress">

            <div className="phone-progress-line">
              <span />
              <span />
              <span />
            </div>

            <div className="phone-progress-labels">
              <small>Picked up</small>
              <small>Ironing</small>
              <small>Delivery</small>
            </div>

          </div>

        </div>


        {/* ORDER STATUS */}
        <div className="app-order-card">

          <div className="app-order-icon">
            <Truck size={16} />
          </div>

          <div>

            <span>
              Order status
            </span>

            <strong>
              {ios
                ? "Ready for delivery"
                : "On the way to you"}
            </strong>

          </div>

        </div>

      </div>


      {/* PHONE BOTTOM NAV */}
      <div className="phone-bottom-nav">

        <div className="phone-nav-item active">
          <CalendarCheck size={15} />
          <span>Book</span>
        </div>

        <div className="phone-nav-item">
          <PackageCheck size={15} />
          <span>Orders</span>
        </div>

        <div className="phone-nav-item">
          <MapPin size={15} />
          <span>Track</span>
        </div>

        <div className="phone-nav-item">
          <Smartphone size={15} />
          <span>Profile</span>
        </div>

      </div>

    </div>
  );
}


// ============================================================
// PLATFORM PHONE
// ============================================================

function PlatformPhone({ platform }) {

  const ios = platform === "iOS";

  return (
    <motion.div
      className={`app-phone-device ${
        ios ? "ios-phone" : "android-phone"
      }`}

      animate={{
        y: [0, -7, 0],
      }}

      transition={{
        duration: ios ? 5.2 : 4.8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: ios ? 0.35 : 0,
      }}
    >

      {/* =====================================================
          PLATFORM BADGE
      ===================================================== */}

      <div className="app-platform-badge">

        {ios ? (
          <Apple size={15} />
        ) : (
          <Smartphone size={15} />
        )}

        <span>
          {platform}
        </span>

      </div>


      {/* PHONE */}
      <PhoneScreen ios={ios} />

    </motion.div>
  );
}


// ============================================================
// OUR APP PAGE
// ============================================================

export default function OurApp() {

  return (
    <section
      className="our-app-section"
      id="app"
    >

      <div className="our-app-container">


        {/* ====================================================
            PAGE HEADING
        ==================================================== */}

        <motion.div
          className="our-app-heading"

          initial={{
            opacity: 0,
            y: 30,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
            amount: 0.2,
          }}

          transition={{
            duration: 0.7,
          }}
        >

          <div className="section-label">

            <Smartphone size={15} />

            <span>
              OUR APP
            </span>

          </div>


          <h2>
            Your clothing care,
            <br />

            <span>
              in your hands.
            </span>
          </h2>


          <p>
            Book professional ironing, manage your orders
            and track your clothes effortlessly through the
            RPS Associated app.
          </p>

        </motion.div>


        {/* ====================================================
            MAIN APP CONTENT

            IMPORTANT:
            1. BOTH PHONES FIRST
            2. PHONES SIDE-BY-SIDE
            3. ALL CONTENT BELOW PHONES
        ==================================================== */}

        <div
          className="our-app-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >


          {/* ==================================================
              PHONES SECTION
          ================================================== */}

          <motion.div
            className="app-phone-wrapper"

            initial={{
              opacity: 0,
              y: 35,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

            viewport={{
              once: true,
              amount: 0.2,
            }}

            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}

            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >

            {/* PURPLE GLOW */}
            <div className="app-phone-glow" />


            {/* ==================================================
                PHONE ROW

                ANDROID + IOS
                SIDE BY SIDE
                INCREASED GAP
            ================================================== */}

            <div
              className="app-phones"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "center",
                flexWrap: "nowrap",
                width: "100%",
                gap: "55px",
                position: "relative",
                zIndex: 2,
              }}
            >

              {/* =================================================
                  ANDROID PHONE
              ================================================= */}

              <PlatformPhone
                platform="Android"
              />


              {/* =================================================
                  IOS PHONE
              ================================================= */}

              <PlatformPhone
                platform="iOS"
              />

            </div>


            {/* ==================================================
                FLOATING LOCATION BADGE
            ================================================== */}

            <motion.div
              className="app-floating-badge"

              animate={{
                y: [0, -7, 0],
              }}

              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >

              <MapPin size={17} />

              <div>

                <span>
                  Doorstep service
                </span>

                <strong>
                  We'll come to you
                </strong>

              </div>

            </motion.div>

          </motion.div>



          {/* ====================================================
              CONTENT BELOW BOTH PHONES
          ==================================================== */}

          <motion.div
            className="our-app-features"

            initial={{
              opacity: 0,
              y: 35,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

            viewport={{
              once: true,
              amount: 0.2,
            }}

            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}

            style={{
              width: "100%",
              maxWidth: "1000px",
              margin: "85px auto 0",
            }}
          >


            {/* ==================================================
                MADE FOR CONVENIENCE
            ================================================== */}

            <div className="app-feature-heading">

              <div className="section-label">

                <span>
                  ✦
                </span>

                <span>
                  MADE FOR CONVENIENCE
                </span>

              </div>


              <h2>
                Everything you need,
                <span>
                  {" "}in one place.
                </span>
              </h2>

            </div>



            {/* ==================================================
                FEATURE CARDS
            ================================================== */}

            <div className="app-feature-list">

              {features.map(
                (feature, index) => {

                  const Icon = feature.icon;

                  return (
                    <motion.div
                      className="app-feature"
                      key={feature.title}

                      initial={{
                        opacity: 0,
                        y: 18,
                      }}

                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}

                      viewport={{
                        once: true,
                      }}

                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                    >

                      <div className="app-feature-icon">
                        <Icon size={21} />
                      </div>


                      <div className="app-feature-content">

                        <h3>
                          {feature.title}
                        </h3>

                        <p>
                          {feature.text}
                        </p>

                      </div>

                    </motion.div>
                  );
                }
              )}

            </div>



            {/* ==================================================
                BENEFITS
            ================================================== */}

            <div className="app-benefits">

              <div>
                <CheckCircle2 size={16} />

                <span>
                  Simple booking
                </span>
              </div>


              <div>
                <CheckCircle2 size={16} />

                <span>
                  Professional ironing
                </span>
              </div>


              <div>
                <CheckCircle2 size={16} />

                <span>
                  Live updates
                </span>
              </div>

            </div>



            {/* ==================================================
                DOWNLOAD BUTTONS
            ================================================== */}

            <div className="app-download-buttons">

              {/* ANDROID */}
              <a
                href="/downloads/rps-associated-android.apk"
                className="app-download-button"
                download
              >

                <Download size={18} />

                <span>
                  Download for Android
                </span>

                <ArrowRight size={18} />

              </a>


              {/* IOS */}
              <a
                href="/downloads/rps-associated-ios"
                className="app-download-button app-ios-download"
              >

                <Apple size={18} />

                <span>
                  Download for iOS
                </span>

                <ArrowRight size={18} />

              </a>

            </div>



            {/* ==================================================
                DOWNLOAD NOTE
            ================================================== */}

            <p className="app-coming-soon">
              Available for Android and iOS. Download the app
              and manage your ironing orders from anywhere.
            </p>

          </motion.div>

        </div>

      </div>

    </section>
  );
}