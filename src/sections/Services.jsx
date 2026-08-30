import { motion } from "framer-motion";
import {
  Shirt,
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
    icon: Truck,
    title: "Pickup & Delivery",
    description:
      "We collect your clothes from your doorstep and bring them back once they are freshly pressed.",
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

        {/* =====================================================
            SECTION 1 — SERVICES
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
            Professional ironing,
            <span> made simple.</span>
          </h2>

          <p>
            From everyday shirts to formal wear, RPS Associatied provides
            professional ironing with convenient doorstep pickup and delivery.
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
                key={service.title}
                initial={{
                  opacity: 0,
                  y: 25,
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

                <h3>
                  {service.title}
                </h3>


                {/* Divider */}

                <div className="service-card-divider" />


                {/* Description */}

                <p>
                  {service.description}
                </p>


                {/* Includes */}

                <div className="service-includes">

                  <strong>
                    Includes
                  </strong>

                  <div className="service-includes-list">

                    {service.features.map((feature) => (
                      <div
                        className="service-feature"
                        key={feature}
                      >
                        <CheckCircle2 size={16} />

                        <span>
                          {feature}
                        </span>
                      </div>
                    ))}

                  </div>

                </div>

              </motion.article>
            );
          })}

        </div>


        {/* =====================================================
            SECTION 2 — ORDER CTA
        ===================================================== */}

        <motion.div
          className="services-order-cta"
          initial={{
            opacity: 0,
            y: 25,
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

          {/* CTA Icon */}

          <div className="services-order-icon">
            <Shirt size={30} />
          </div>


          {/* CTA Content */}

          <div className="services-order-content">

            <h3>
              Ready for perfectly pressed clothes?
            </h3>

            <p>
              Place your ironing order and let RPS take care of the rest.
            </p>

          </div>


          {/* =================================================
              PLACE ORDER → OUR APP
          ================================================= */}

          <Link
            to="/our-app"
            className="services-order-button"
          >
            <span>
              Place Order
            </span>

            <ArrowRight size={19} />
          </Link>

        </motion.div>

      </div>
    </main>
  );
}