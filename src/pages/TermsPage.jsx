import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <section className="legal-page">
      <div className="legal-container">

        <motion.div
          className="legal-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          {/* HEADER */}
          <div className="legal-header">

            <div className="legal-label">
              <FileText size={16} />
              <span>TERMS & CONDITIONS</span>
            </div>

            <h1>
              Simple terms,
              <span> clear service.</span>
            </h1>

            <p>
              These terms describe the general conditions for using RPS
              Associated services and website.
            </p>

          </div>

          {/* CONTENT */}
          <div className="legal-content">

            <div className="legal-section">
              <h2>1. Use of Our Services</h2>
              <p>
                By using RPS Associated services, you agree to provide
                accurate information and use the service responsibly.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. Service Booking</h2>
              <p>
                Service bookings are subject to availability and the service
                area supported by RPS Associated.
              </p>
            </div>

            <div className="legal-section">
              <h2>3. Clothing Care</h2>
              <p>
                Customers should provide accurate information about their
                clothes and communicate any special care requirements before
                placing an order.
              </p>
            </div>

            <div className="legal-section">
              <h2>4. Pickup & Delivery</h2>
              <p>
                Pickup and delivery times may vary depending on location,
                availability and operational conditions.
              </p>
            </div>

            <div className="legal-section">
              <h2>5. Changes to Services</h2>
              <p>
                RPS Associated may modify, update or discontinue services or
                features when necessary.
              </p>
            </div>

            <div className="legal-section">
              <h2>6. Contact</h2>
              <p>
                If you have any questions regarding these terms, please
                contact the RPS Associated team.
              </p>
            </div>

          </div>

          {/* BACK */}
          <Link to="/" className="legal-back">
            <ArrowLeft size={17} />
            Back to Home
          </Link>

        </motion.div>

      </div>
    </section>
  );
}