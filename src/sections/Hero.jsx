import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  Sparkles,
  Smartphone,
  Apple,
  Shirt,
  WashingMachine,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero-section" id="home">
      {/* Background atmosphere */}
      <div className="hero-background-shape shape-one" />
      <div className="hero-background-shape shape-two" />
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />

      <div className="hero-container">

        {/* =================================================
            LEFT CONTENT
        ================================================= */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: "easeOut",
          }}
        >
          <div className="hero-eyebrow">
            <span>Professional clothing care</span>
          </div>

          <h1>
            Fresh clothes.
            <span> Made simple.</span>
          </h1>

          <p className="hero-description">
            RPS Associated brings professional ironing, laundry and
            doorstep clothing care closer to you. Quality care,
            convenient service and beautifully finished clothes —
            all in one place.
          </p>

          <div className="hero-actions">

            <Link
              to="/app"
              className="primary-button"
            >
              <Download size={18} />
              Get the RPS App
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/services"
              className="secondary-button"
            >
              Explore Services
            </Link>

          </div>

          <div className="hero-trust">

            <div>
              <Check size={16} />
              <span>Professional Care</span>
            </div>

            <div>
              <Check size={16} />
              <span>Doorstep Convenience</span>
            </div>

            <div>
              <Check size={16} />
              <span>Quality Finish</span>
            </div>

          </div>
        </motion.div>


        {/* =================================================
            RIGHT ANIMATION
        ================================================= */}
        <div className="hero-visual">

          {/* =================================================
              GLASS SPHERE
          ================================================= */}
          <motion.div
            className="glass-sphere"
            initial={{
              opacity: 0,
              y: -260,
              scale: 0.55,
            }}
            animate={{
              opacity: [0, 1, 1, 1, 0],
              y: [-260, -180, 0, 0, 0],
              scale: [0.55, 0.8, 1, 1.15, 1.4],
            }}
            transition={{
              duration: 2.1,
              times: [0, 0.2, 0.68, 0.76, 1],
              ease: "easeIn",
              delay: 0.15,
            }}
          >
            <div className="sphere-highlight" />
            <div className="sphere-inner" />
          </motion.div>


          {/* =================================================
              IMPACT FLASH
          ================================================= */}
          <motion.div
            className="impact-flash"
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 2],
            }}
            transition={{
              duration: 0.65,
              delay: 1.55,
              ease: "easeOut",
            }}
          />


          {/* =================================================
              BLAST RINGS
          ================================================= */}
          <motion.div
            className="blast-ring blast-ring-one"
            initial={{
              opacity: 0,
              scale: 0.1,
            }}
            animate={{
              opacity: [0, 0.9, 0],
              scale: [0.1, 1, 1.8],
            }}
            transition={{
              duration: 1,
              delay: 1.52,
              ease: "easeOut",
            }}
          />

          <motion.div
            className="blast-ring blast-ring-two"
            initial={{
              opacity: 0,
              scale: 0.1,
            }}
            animate={{
              opacity: [0, 0.65, 0],
              scale: [0.1, 0.75, 1.5],
            }}
            transition={{
              duration: 0.9,
              delay: 1.62,
              ease: "easeOut",
            }}
          />


          {/* =================================================
              GLASS PARTICLES
          ================================================= */}
          <div className="glass-particles">

            {Array.from({ length: 14 }).map((_, index) => {
              const angle =
                (index / 14) * Math.PI * 2;

              const x =
                Math.cos(angle) * (100 + (index % 3) * 35);

              const y =
                Math.sin(angle) * (80 + (index % 4) * 25);

              return (
                <motion.span
                  key={index}
                  className="glass-particle"
                  style={{
                    "--particle-x": `${x}px`,
                    "--particle-y": `${y}px`,
                    "--particle-rotate": `${index * 37}deg`,
                  }}
                  initial={{
                    opacity: 0,
                    x: 0,
                    y: 0,
                    scale: 0,
                    rotate: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: [0, x],
                    y: [0, y],
                    scale: [0, 1, 0.2],
                    rotate: [0, index * 37],
                  }}
                  transition={{
                    duration: 1.15,
                    delay: 1.52 + index * 0.015,
                    ease: "easeOut",
                  }}
                />
              );
            })}

          </div>


          {/* =================================================
              PHONES
          ================================================= */}
          <div className="hero-phones">

            {/* ANDROID */}
            <motion.div
              className="hero-phone phone-android"
              initial={{
                opacity: 0,
                y: 90,
                scale: 0.7,
                rotate: -12,
              }}
              animate={{
                opacity: 1,
                y: [25, 15, 25],
                scale: 1,
                rotate: [-8, -6, -8],
              }}
              transition={{
                opacity: {
                  duration: 0.55,
                  delay: 1.72,
                },
                scale: {
                  duration: 0.65,
                  delay: 1.72,
                  type: "spring",
                  stiffness: 120,
                },
                y: {
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2.35,
                },
                rotate: {
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2.35,
                },
              }}
            >
              <PhoneScreen platform="android" />
            </motion.div>


            {/* iPHONE */}
            <motion.div
              className="hero-phone phone-ios"
              initial={{
                opacity: 0,
                y: 90,
                scale: 0.7,
                rotate: 12,
              }}
              animate={{
                opacity: 1,
                y: [-5, -15, -5],
                scale: 1,
                rotate: [8, 6, 8],
              }}
              transition={{
                opacity: {
                  duration: 0.55,
                  delay: 1.86,
                },
                scale: {
                  duration: 0.65,
                  delay: 1.86,
                  type: "spring",
                  stiffness: 120,
                },
                y: {
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2.45,
                },
                rotate: {
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2.45,
                },
              }}
            >
              <PhoneScreen platform="ios" />
            </motion.div>

          </div>


          {/* =================================================
              PLATFORM LABELS
          ================================================= */}
          <motion.div
            className="platform-badge platform-android-badge"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 2.25,
            }}
          >
            <Smartphone size={15} />
            <span>Android</span>
          </motion.div>


          <motion.div
            className="platform-badge platform-ios-badge"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 2.35,
            }}
          >
            <Apple size={15} />
            <span>iOS</span>
          </motion.div>

        </div>
      </div>
    </section>
  );
}


/* =========================================================
   PHONE SCREEN
========================================================= */

function PhoneScreen({ platform }) {
  return (
    <div className="phone-frame">

      {/* Notch / speaker */}
      <div className="phone-top-area">
        {platform === "ios" ? (
          <div className="dynamic-island" />
        ) : (
          <div className="android-camera" />
        )}
      </div>


      {/* App Header */}
      <div className="phone-app-header">

        <div>
          <small>Welcome to</small>
          <strong>RPS Associated</strong>
        </div>

        <div className="phone-avatar">
          R
        </div>

      </div>


      {/* App Content */}
      <div className="phone-content">

        <small className="phone-label">
          CLOTHING CARE
        </small>

        <h3>
          Care for your clothes.
        </h3>

        <p>
          Professional care, made convenient.
        </p>


        {/* Services */}
        <div className="phone-services">

          <div className="phone-service-card active">

            <div className="phone-service-icon">
              <Shirt size={17} />
            </div>

            <div>
              <strong>Ironing</strong>
              <span>Fresh & pressed</span>
            </div>

          </div>


          <div className="phone-service-card">

            <div className="phone-service-icon">
              <WashingMachine size={17} />
            </div>

            <div>
              <strong>Laundry</strong>
              <span>Wash & care</span>
            </div>

          </div>

        </div>


        {/* CTA */}
        <div className="phone-book-button">
          Explore RPS
          <ArrowRight size={13} />
        </div>

      </div>


      {/* Bottom navigation */}
      <div className="phone-bottom-nav">

        <span className="phone-nav-active">
          Home
        </span>

        <span>
          Services
        </span>

        <span>
          Profile
        </span>

      </div>

    </div>
  );
}