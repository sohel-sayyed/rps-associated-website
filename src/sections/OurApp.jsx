import { motion } from "framer-motion";
import {
  Smartphone,
  CalendarCheck,
  PackageCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  MapPin,
} from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    text: "Book ironing or laundry services in just a few taps.",
  },
  {
    icon: PackageCheck,
    title: "Order Tracking",
    text: "Track your clothing order from pickup to delivery.",
  },
  {
    icon: Truck,
    title: "Doorstep Pickup",
    text: "Schedule convenient pickup and delivery from your home.",
  },
];

export default function OurApp() {
  return (
    <section className="our-app-section" id="app">
      <div className="our-app-container">

        {/* =====================================================
            SECTION HEADING
        ===================================================== */}

        <motion.div
          className="our-app-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label">
            <Smartphone size={15} />
            <span>OUR APP</span>
          </div>

          <h2>
            Your clothing care,
            <br />
            <span>in your hands.</span>
          </h2>

          <p>
            Book services, manage your orders and track your clothes
            effortlessly through the RPS Associated app.
          </p>
        </motion.div>

        {/* =====================================================
            MAIN APP CONTENT
        ===================================================== */}

        <div className="our-app-content">

          {/* ===================================================
              PHONE
          =================================================== */}

          <motion.div
            className="app-phone-wrapper"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            {/* Purple glow */}

            <div className="app-phone-glow" />

            {/* Phone */}

            <div className="app-phone">

              {/* =================================================
                  PHONE HEADER
              ================================================= */}

              <div className="app-phone-header">

                <div>
                  <span>Welcome back</span>

                  <strong>RPS Associatied</strong>
                </div>

                <div className="app-phone-avatar">
                  R
                </div>

              </div>

              {/* =================================================
                  PHONE BODY
              ================================================= */}

              <div className="app-phone-body">

                <span className="app-small-text">
                  Need fresh clothes?
                </span>

                <h3>
                  Book a service
                </h3>

                {/* =================================================
                    SERVICE CARDS
                ================================================= */}

                <div className="app-service-grid">

                  {/* Ironing */}

                  <div className="app-service-card active">

                    <div className="app-service-icon">
                      <Smartphone size={20} />
                    </div>

                    <strong>
                      Ironing
                    </strong>

                    <span>
                      Fresh & pressed
                    </span>

                  </div>

                  {/* Laundry */}

                  <div className="app-service-card">

                    <div className="app-service-icon">
                      <PackageCheck size={20} />
                    </div>

                    <strong>
                      Laundry
                    </strong>

                    <span>
                      Wash & fold
                    </span>

                  </div>

                </div>

                {/* =================================================
                    ORDER STATUS
                ================================================= */}

                <div className="app-order-card">

                  <div className="app-order-icon">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>
                    <span>
                      Order status
                    </span>

                    <strong>
                      Ready for delivery
                    </strong>
                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                FLOATING LOCATION CARD
            ================================================= */}

            <motion.div
              className="app-floating-badge"
              animate={{
                y: [0, -8, 0],
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

          {/* ===================================================
              RIGHT SIDE
          =================================================== */}

          <motion.div
            className="our-app-features"
            initial={{
              opacity: 0,
              x: 50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >

            {/* =================================================
                RIGHT HEADING
            ================================================= */}

            <div className="app-feature-heading">

              <div className="section-label">

                <span>✦</span>

                <span>
                  MADE FOR CONVENIENCE
                </span>

              </div>

              <h2>
                Everything you need,
                <span> in one place.</span>
              </h2>

            </div>

            {/* =================================================
                FEATURE CARDS
            ================================================= */}

            <div className="app-feature-list">

              {features.map((feature, index) => {

                const Icon = feature.icon;

                return (
                  <motion.div
                    className="app-feature"
                    key={feature.title}
                    initial={{
                      opacity: 0,
                      y: 20,
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
                      delay: index * 0.12,
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

              })}

            </div>

            {/* =================================================
                BENEFITS
            ================================================= */}

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
                  Professional care
                </span>
              </div>

              <div>
                <CheckCircle2 size={16} />

                <span>
                  Live updates
                </span>
              </div>

            </div>

            {/* =================================================
                DOWNLOAD BUTTON
            ================================================= */}

            <button className="app-download-button">

              <Smartphone size={18} />

              <span>
                Get the RPS App
              </span>

              <ArrowRight size={18} />

            </button>

            {/* =================================================
                COMING SOON
            ================================================= */}

            <p className="app-coming-soon">
              App download links will be available when the RPS app
              is officially published.
            </p>

          </motion.div>

        </div>

      </div>
    </section>
  );
}