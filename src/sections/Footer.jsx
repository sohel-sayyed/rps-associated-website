import { motion } from "framer-motion";
import {
  Sparkles,
  Shirt,
  WashingMachine,
  Truck,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Top Footer */}
        <motion.div
          className="footer-top"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >

          {/* Brand */}
          <div className="footer-brand">
            <Link
              to="/"
              className="footer-logo"
              aria-label="Go to home"
            >
              <span className="footer-logo-box">R</span>

              <span className="footer-logo-text">
                <strong>RPS</strong>
                <small>ASSOCIATED</small>
              </span>
            </Link>

            <p>
              Professional ironing, laundry and doorstep clothing care
              made simple.
            </p>

            <div className="footer-contact-mini">
              <a href="tel:+910000000000">
                <Phone size={15} />
                <span>+91 XXXXX XXXXX</span>
              </a>

              <a href="mailto:hello@rpsassociated.com">
                <Mail size={15} />
                <span>hello@rpsassociated.com</span>
              </a>

              <div>
                <MapPin size={15} />
                <span>Your Local Area</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3>Quick Links</h3>

            <Link to="/">
              Home
            </Link>

            <Link to="/services">
              Services
            </Link>

            <Link to="/how-it-works">
              How It Works
            </Link>

            <Link to="/app">
              Our App
            </Link>

            <Link to="/about">
              About
            </Link>

            <Link to="/contact">
              Contact
            </Link>
          </div>

          {/* Services */}
          <div className="footer-column">
            <h3>Our Services</h3>

            <Link to="/services">
              <Shirt size={15} />
              Professional Ironing
            </Link>

            <Link to="/services">
              <WashingMachine size={15} />
              Laundry Care
            </Link>

            <Link to="/services">
              <Truck size={15} />
              Pickup & Delivery
            </Link>
          </div>

          {/* CTA */}
          <div className="footer-cta">
            <div className="footer-cta-icon">
              <Sparkles size={20} />
            </div>

            <h3>Fresh clothes.</h3>
            <h3 className="purple-text">Zero hassle.</h3>

            <p>
              Book professional clothing care and let us take care of
              the rest.
            </p>

            <Link
              to="/app"
              className="footer-cta-button"
            >
              Get the RPS App
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom Footer */}
        <div className="footer-bottom">

          <p>
            © 2026 <strong>RPS Associated</strong>. All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <Link to="/privacy-policy">
  Privacy Policy
</Link>

<Link to="/terms">
  Terms & Conditions
</Link>
          </div>

          <Link
            to="/"
            className="back-to-top"
          >
            Back to home
            <ArrowUpRight size={15} />
          </Link>

        </div>

      </div>
    </footer>
  );
}