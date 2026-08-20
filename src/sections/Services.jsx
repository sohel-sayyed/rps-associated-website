import { motion } from "framer-motion";
import {
  Shirt,
  WashingMachine,
  Truck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Shirt,
    title: "Professional Ironing",
    description:
      "Get your everyday clothes professionally pressed, crisp and ready to wear.",
    features: [
      "Shirts",
      "Trousers",
      "T-Shirts",
      "Dresses",
      "Other Clothing",
    ],
  },
  {
    icon: WashingMachine,
    title: "Laundry Care",
    description:
      "Reliable washing and folding service that takes care of your clothes from start to finish.",
    features: [
      "Wash & Fold",
      "Everyday Wear",
      "Delicate Fabric Care",
      "Clothing Care",
    ],
  },
  {
    icon: Truck,
    title: "Pickup & Delivery",
    description:
      "We collect your clothes and bring them back to your doorstep when they are ready.",
    features: [
      "Doorstep Pickup",
      "Real-time Updates",
      "Easy Tracking",
      "Home Delivery",
    ],
  },
];

export default function Services() {
  return (
    <main className="services-section">
      <div className="services-container">

        {/* =========================
            PAGE INTRO
        ========================== */}

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


        {/* =========================
            SERVICE CARDS
        ========================== */}

        <div className="services-grid">

          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.article
                className="service-card"
                key={service.title}
                initial={{
                  opacity: 0,
                  y: 30,
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

                {/* Icon */}

                <div className="service-card-icon">
                  <Icon
                    size={28}
                    strokeWidth={1.8}
                  />
                </div>


                {/* Title */}

                <h3>{service.title}</h3>


                {/* Small divider */}

                <div className="service-card-divider"></div>


                {/* Description */}

                <p>{service.description}</p>


                {/* Includes */}

                <div className="service-includes">

                  <strong>Includes</strong>

                  <div className="service-includes-list">

                    {service.features.map((feature) => (
                      <div
                        className="service-feature"
                        key={feature}
                      >
                        <CheckCircle2 size={16} />
                        <span>{feature}</span>
                      </div>
                    ))}

                  </div>

                </div>

              </motion.article>
            );
          })}

        </div>


        {/* =========================
            PLACE ORDER CTA
        ========================== */}

        <motion.div
          className="services-order-cta"
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

          <div className="services-order-icon">
            <Shirt size={30} />
          </div>

          <div className="services-order-content">

            <h3>
              Ready to get your clothes cared for?
            </h3>

            <p>
              Book our services in just a few simple steps.
            </p>

          </div>


          <Link
            to="/book-service"
            className="services-order-button"
          >
            <span>Place Order</span>
            <ArrowRight size={19} />
          </Link>

        </motion.div>

      </div>
    </main>
  );
}