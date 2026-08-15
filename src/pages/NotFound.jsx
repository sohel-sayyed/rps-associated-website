import { motion } from "framer-motion";
import { ArrowLeft, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="not-found-section">
      <div className="not-found-container">

        <motion.div
          className="not-found-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="not-found-icon">
            <Sparkles size={24} />
          </div>

          <span className="not-found-code">
            404
          </span>

          <h1>
            Page not
            <span> found.</span>
          </h1>

          <p>
            The page you're looking for doesn't exist or may have
            been moved. Let's get you back to RPS Associated.
          </p>

          <div className="not-found-actions">

            <Link
              to="/"
              className="not-found-primary"
            >
              <Home size={17} />
              Back to Home
            </Link>

            <button
              type="button"
              className="not-found-secondary"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={17} />
              Go Back
            </button>

          </div>
        </motion.div>

      </div>
    </section>
  );
}