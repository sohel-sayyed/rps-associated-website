import { motion } from "framer-motion";
import {
  Shirt,
  WashingMachine,
  Truck,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Smartphone,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    number: "01",
    icon: Shirt,
    title: "Professional Ironing",
    description:
      "Get your everyday clothes professionally pressed, crisp and ready to wear.",
    features: ["Shirts", "Trousers", "T-Shirts"],
  },
  {
    number: "02",
    icon: WashingMachine,
    title: "Laundry Care",
    description:
      "Reliable washing and folding service that takes care of your clothes from start to finish.",
    features: ["Wash & Fold", "Everyday Wear", "Clothing Care"],
  },
  {
    number: "03",
    icon: Truck,
    title: "Pickup & Delivery",
    description:
      "We collect your clothes and bring them back to your doorstep when they are ready.",
    features: ["Doorstep Pickup", "Easy Tracking", "Home Delivery"],
  },
];

const benefits = [
  "Professional clothing care",
  "Convenient doorstep service",
  "Easy order tracking",
  "Simple booking through the app",
];

export default function Services() {
  return (
    <section className="services-section" id="services">
      <div className="services-container">

        {/* =====================================================
            PAGE INTRO
        ===================================================== */}

        <motion.div
          className="services-heading"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label">
            <Sparkles size={14} />
            <span>OUR SERVICES</span>
          </div>

          <h2>
            Care for every
            <span> piece you wear.</span>
          </h2>

          <p>
            From perfectly pressed shirts to convenient doorstep
            pickup, RPS Associatied makes clothing care simple,
            convenient and reliable.
          </p>
        </motion.div>

        {/* =====================================================
            SERVICE CARDS
        ===================================================== */}

        <div className="services-grid">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.article
                className="service-card"
                key={service.number}
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
                {/* Top */}
                <div className="service-card-top">
                  <span className="service-number">
                    {service.number}
                  </span>

                  <div className="service-card-icon">
                    <Icon
                      size={25}
                      strokeWidth={1.8}
                    />
                  </div>
                </div>

                {/* Content */}
                <h3>{service.title}</h3>

                <p>{service.description}</p>

                {/* Features */}
                <div className="service-features">
                  {service.features.map((feature) => (
                    <span key={feature}>
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <Link
                  to="/contact"
                  className="service-link"
                >
                  Learn more
                  <ArrowUpRight size={17} />
                </Link>
              </motion.article>
            );
          })}
        </div>

        {/* =====================================================
            WHY RPS
        ===================================================== */}

        <motion.div
          className="services-benefits"
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
            delay: 0.35,
          }}
        >
          <div className="services-benefits-content">

            <div className="section-label">
              <Sparkles size={14} />
              <span>WHY RPS ASSOCIATIED</span>
            </div>

            <h3>
              Professional care,
              <span> without the hassle.</span>
            </h3>

            <p>
              We make clothing care easier by combining professional
              handling with convenient pickup, delivery and simple
              order management.
            </p>

            <Link
              to="/app"
              className="services-app-button"
            >
              <Smartphone size={17} />
              Get the RPS App
              <ArrowUpRight size={16} />
            </Link>

          </div>

          <div className="services-benefits-list">
            {benefits.map((benefit) => (
              <div
                className="services-benefit-item"
                key={benefit}
              >
                <CheckCircle2 size={18} />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}