import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicyPage() {
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
              <ShieldCheck size={16} />
              <span>PRIVACY POLICY</span>
            </div>

            <h1>
              Your privacy,
              <span> protected.</span>
            </h1>

            <p>
              At RPS Associated, we respect your privacy and are committed to
              protecting the information you share with us.
            </p>

          </div>

          {/* CONTENT */}
          <div className="legal-content">

            <div className="legal-section">
              <h2>1. Information We Collect</h2>
              <p>
                We may collect information such as your name, phone number,
                email address, service details and delivery information when
                you use our website or services.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. How We Use Your Information</h2>
              <p>
                Your information may be used to process service requests,
                arrange pickup and delivery, communicate with you and improve
                our services.
              </p>
            </div>

            <div className="legal-section">
              <h2>3. Information Protection</h2>
              <p>
                We take reasonable measures to protect your personal
                information from unauthorized access, misuse or disclosure.
              </p>
            </div>

            <div className="legal-section">
              <h2>4. Sharing of Information</h2>
              <p>
                We do not sell your personal information. Information may be
                shared with service partners only when necessary to provide
                requested services.
              </p>
            </div>

            <div className="legal-section">
              <h2>5. Contact</h2>
              <p>
                If you have questions about this Privacy Policy, please
                contact the RPS Associated team through our Contact page.
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