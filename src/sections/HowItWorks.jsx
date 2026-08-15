import { motion } from "framer-motion";
import {
  CalendarCheck,
  Truck,
  Sparkles,
  PackageCheck,
  Smartphone,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: CalendarCheck,
    title: "Book a Service",
    text: "Choose ironing or laundry service and place your order through the RPS app.",
    details: [
      "Choose your preferred service",
      "Select the clothes you want to send",
      "Place your order in a few simple steps",
    ],
  },
  {
    number: "02",
    icon: Truck,
    title: "We Pick Up",
    text: "Our delivery partner collects your clothes conveniently from your doorstep.",
    details: [
      "Schedule a convenient pickup",
      "Hand over your clothes at your doorstep",
      "Track your order through the app",
    ],
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Professional Care",
    text: "Your clothes are carefully handled and professionally pressed or cleaned.",
    details: [
      "Clothes are handled with care",
      "Professional ironing and laundry",
      "Quality-focused clothing care",
    ],
  },
  {
    number: "04",
    icon: PackageCheck,
    title: "Ready for Delivery",
    text: "Once your clothes are ready, we deliver them back to your doorstep.",
    details: [
      "Receive order status updates",
      "Clothes are prepared for delivery",
      "Get your clothes back at your doorstep",
    ],
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works-container">

        {/* =====================================================
            PAGE HEADING
        ===================================================== */}

        <motion.div
          className="how-it-works-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label">
            <Sparkles size={15} />
            <span>HOW IT WORKS</span>
          </div>

          <h2>
            Simple from
            <span> start to finish.</span>
          </h2>

          <p>
            From booking to doorstep delivery, RPS Associatied makes
            professional clothing care simple and convenient.
          </p>
        </motion.div>

        {/* =====================================================
            PROCESS TIMELINE
        ===================================================== */}

        <div className="how-process">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.article
                className="process-step"
                key={step.number}
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.12,
                }}
              >

                {/* Step Number */}
                <div className="process-number">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="process-icon">
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <div className="process-content">

                  <span className="process-label">
                    STEP {step.number}
                  </span>

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.text}
                  </p>

                  <div className="process-details">
                    {step.details.map((detail) => (
                      <div
                        className="process-detail"
                        key={detail}
                      >
                        <CheckCircle2 size={15} />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="process-connector">
                    <span />
                  </div>
                )}

              </motion.article>
            );
          })}

        </div>

        {/* =====================================================
            APP CTA
        ===================================================== */}

        <motion.div
          className="how-app-cta"
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.45,
          }}
        >

          <div className="how-app-cta-content">

            <div className="how-app-icon">
              <Smartphone size={22} />
            </div>

            <div>
              <span>READY WHEN YOU ARE</span>

              <h3>
                Book your clothing care
                <strong> in a few taps.</strong>
              </h3>

              <p>
                Use the RPS app to book services, manage orders and
                stay updated from pickup to delivery.
              </p>
            </div>

          </div>

          <Link
            to="/app"
            className="how-app-button"
          >
            Get the RPS App
            <ArrowUpRight size={17} />
          </Link>

        </motion.div>

      </div>
    </section>
  );
}