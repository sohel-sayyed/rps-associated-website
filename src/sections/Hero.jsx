import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  Sparkles,
  Shirt,
  Clock3,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-background-shape shape-one" />
      <div className="hero-background-shape shape-two" />

      <div className="hero-container">

        {/* LEFT CONTENT */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="hero-eyebrow">
            <Sparkles size={15} />
            <span>Professional clothing care</span>
          </div>

          <h1>
            Clothes that look
            <span> freshly pressed.</span>
          </h1>

          <p className="hero-description">
            RPS Associatied brings professional ironing and clothing
            care straight to your doorstep. Book, manage and track
            your orders effortlessly through our app.
          </p>

          <div className="hero-actions">

            {/* Download App → Our App Page */}
            <Link
              to="/app"
              className="primary-button"
            >
              <Download size={18} />
              Download App
              <ArrowRight size={17} />
            </Link>

            {/* Explore Services → Services Page */}
            <Link
              to="/services"
              className="secondary-button"
            >
              Explore Services
            </Link>

          </div>

          <div className="hero-trust">
            <div>
              <Check size={16} />
              <span>Doorstep Pickup</span>
            </div>

            <div>
              <Check size={16} />
              <span>Professional Care</span>
            </div>

            <div>
              <Check size={16} />
              <span>Easy Tracking</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT VISUAL */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >

          {/* Main App Card */}
          <motion.div
            className="app-showcase"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="app-top">
              <div>
                <small>Welcome back</small>
                <strong>RPS Associatied</strong>
              </div>

              <div className="app-avatar">R</div>
            </div>

            <div className="app-heading">
              <small>Need fresh clothes?</small>
              <strong>Book a service</strong>
            </div>

            <div className="app-services">
              <div className="app-service active">
                <div className="service-icon">
                  <Shirt size={24} />
                </div>

                <strong>Ironing</strong>
                <span>Fresh & pressed</span>
              </div>

              <div className="app-service">
                <div className="service-icon">
                  <Clock3 size={24} />
                </div>

                <strong>Laundry</strong>
                <span>Wash & fold</span>
              </div>
            </div>

            <div className="app-order">
              <div>
                <small>Current order</small>
                <strong>#RPS10245</strong>
              </div>

              <span className="processing">
                Processing
              </span>
            </div>
          </motion.div>

          {/* Floating Status Card */}
          <motion.div
            className="floating-status"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="status-check">
              <Check size={17} />
            </div>

            <div>
              <small>Order status</small>
              <strong>Ready for delivery</strong>
            </div>
          </motion.div>

          {/* Floating Location Card */}
          <motion.div
            className="floating-location"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="location-icon">
              <MapPin size={17} />
            </div>

            <div>
              <small>Doorstep service</small>
              <strong>We'll come to you</strong>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}