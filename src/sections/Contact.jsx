import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

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
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await addDoc(collection(db, "contactMessages"), {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        createdAt: serverTimestamp(),
      });

      setSuccessMessage(
        "Thank you! Your message has been sent successfully."
      );

      // Clear form after successful submission
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);

      setErrorMessage(
        "Something went wrong. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
              onSubmit={handleSubmit}
            >

              {/* Name + Phone */}
              <div className="contact-form-row">

                <div className="contact-field">
                  <label htmlFor="contact-name">Name</label>

                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-phone">Phone</label>

                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    required
                  />
                </div>

              </div>

              {/* Email */}
              <div className="contact-field">
                <label htmlFor="contact-email">Email</label>

                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  required
                />
              </div>

              {/* Message */}
              <div className="contact-field">
                <label htmlFor="contact-message">Message</label>

                <textarea
                  id="contact-message"
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                />
              </div>

              {/* Success Message */}
              {successMessage && (
                <p className="contact-success">
                  {successMessage}
                </p>
              )}

              {/* Error Message */}
              {errorMessage && (
                <p className="contact-error">
                  {errorMessage}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="contact-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}

                {!isSubmitting && (
                  <ArrowRight size={18} />
                )}
              </button>

            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}