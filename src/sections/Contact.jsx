import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

const contactDetails = [
  {
    icon: Phone,
    title: "Call Us",
    text: "+91 XXXXX XXXXX",
    subtext: "Available during service hours",
  },
  {
    icon: Mail,
    title: "Email Us",
    text: "hello@rpsassociated.com",
    subtext: "We'll get back to you soon",
  },
  {
    icon: MapPin,
    title: "Service Area",
    text: "Your Local Area",
    subtext: "Doorstep pickup & delivery",
  },
  {
    icon: Clock3,
    title: "Working Hours",
    text: "9:00 AM – 8:00 PM",
    subtext: "Monday – Sunday",
  },
];

export default function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">

        {/* Heading */}
        <motion.div
          className="contact-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label">
            <MessageCircle size={15} />
            <span>CONTACT RPS</span>
          </div>

          <h2>
            Let's take care of
            <br />
            <span>your clothes.</span>
          </h2>

          <p>
            Have a question, need help with an order, or want to book a
            service? Get in touch with the RPS Associated team.
          </p>
        </motion.div>

        {/* Content */}
        <div className="contact-content">

          {/* Contact Information */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            {contactDetails.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  className="contact-card"
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                >
                  <div className="contact-icon">
                    <Icon size={20} />
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <strong>{item.text}</strong>
                    <p>{item.subtext}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <div className="contact-form-header">
              <h3>Send us a message</h3>
              <p>
                Tell us how we can help and our team will get back to you.
              </p>
            </div>

            <form
              className="contact-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="contact-form-row">
                <div className="contact-field">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                  />
                </div>

                <div className="contact-field">
                  <label>Phone</label>
                  <input
                    type="tel"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <div className="contact-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Your email address"
                />
              </div>

              <div className="contact-field">
                <label>Message</label>
                <textarea
                  rows="5"
                  placeholder="How can we help?"
                />
              </div>

              <button type="submit" className="contact-submit">
                Send Message
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}