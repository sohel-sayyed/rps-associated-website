import { motion } from "framer-motion";
import {
  Sparkles,
  Shirt,
  Truck,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* =================================================
            TOP FOOTER
        ================================================== */}

        <motion.div
          className="footer-top"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >

          {/* =================================================
              BRAND
          ================================================== */}

          <div className="footer-brand">

            <a
              href="/"
              className="footer-logo"
              aria-label="Go to home"
            >
              <span className="footer-logo-box">
                R
              </span>

              <span className="footer-logo-text">
                <strong>RPS</strong>
                <small>ASSOCIATED</small>
              </span>
            </a>

            <p>
              Professional ironing and doorstep clothing care
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


          {/* =================================================
              QUICK LINKS
          ================================================== */}

          <div className="footer-column">

            <h3>
              Quick Links
            </h3>

            <a href="/">
              Home
            </a>

            <a href="/services">
              Services
            </a>

            <a href="/how-it-works">
              How It Works
            </a>

            <a href="/app">
              Our App
            </a>

            <a href="/about">
              About
            </a>

            <a href="/contact">
              Contact
            </a>

          </div>


          {/* =================================================
              OUR SERVICES
          ================================================== */}

          <div className="footer-column">

            <h3>
              Our Services
            </h3>

            <a href="/services">
              <Shirt size={15} />
              Professional Ironing
            </a>

            <a href="/services">
              <Truck size={15} />
              Pickup & Delivery
            </a>

          </div>


          {/* =================================================
              CTA
          ================================================== */}

          <div className="footer-cta">

            <div className="footer-cta-icon">
              <Sparkles size={20} />
            </div>

            <h3>
              Fresh clothes.
            </h3>

            <h3 className="purple-text">
              Zero hassle.
            </h3>

            <p>
              Book professional ironing and let us take care
              of the rest.
            </p>

            <a
              href="/app"
              className="footer-cta-button"
            >
              Get the RPS App
              <ArrowUpRight size={17} />
            </a>

          </div>

        </motion.div>


        {/* =================================================
            DIVIDER
        ================================================== */}

        <div className="footer-divider" />


        {/* =================================================
            BOTTOM FOOTER
        ================================================== */}

        <div className="footer-bottom">

          <p>
            © 2026 <strong>RPS Associated</strong>.
            All rights reserved.
          </p>

          <div className="footer-bottom-links">

            <a href="/privacy-policy">
              Privacy Policy
            </a>

            <a href="/terms">
              Terms & Conditions
            </a>

          </div>

          <a
            href="/"
            className="back-to-top"
          >
            Back to home
            <ArrowUpRight size={15} />
          </a>

        </div>

      </div>
    </footer>
  );
}