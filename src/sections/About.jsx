import { motion } from "framer-motion";
import {
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import aboutImage from "../assets/about-rps.png";

const highlights = [
  {
    icon: Sparkles,
    title: "Professional Care",
    text: "Careful ironing and clothing treatment for a clean, fresh finish.",
  },
  {
    icon: Truck,
    title: "Doorstep Convenience",
    text: "We pick up and deliver your clothes right to your doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Service",
    text: "Your clothes are handled with care from pickup to delivery.",
  },
];

export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-container">

        {/* Image */}
        <motion.div
          className="about-image-wrapper"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="about-image-glow" />

          <div className="about-image-card">
            <img
  src="/assets/about-rps.png"
  alt="Professional RPS clothing care service"
/>

            <div className="about-image-badge">
              <CheckCircle2 size={18} />
              <div>
                <span>Professional Care</span>
                <strong>Handled with care</strong>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="about-content"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="about-label">
            <Sparkles size={15} />
            <span>ABOUT RPS</span>
          </div>

          <h2>
            Clothing care,
            <br />
            <span>made simple.</span>
          </h2>

          <p className="about-description">
            RPS Associated is built to make professional clothing care
            convenient, reliable and accessible. From doorstep pickup to
            professional ironing, laundry and timely delivery, we take care
            of your clothes so you don't have to.
          </p>

          <div className="about-highlights">
            {highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  className="about-highlight"
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12,
                  }}
                >
                  <div className="about-highlight-icon">
                    <Icon size={20} />
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="about-bottom">
            <div className="about-check">
              <CheckCircle2 size={18} />
              <span>Quality-focused service</span>
            </div>

            <div className="about-check">
              <CheckCircle2 size={18} />
              <span>Easy booking & tracking</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}