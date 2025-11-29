import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import "./Footer.css";

function FooterComponent() {
  return (
    <div className="app-footer footer-container no-cursor-track">
      <footer className="text-footer">
        <motion.span
          className="footer-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Built with{" "}
          <motion.span
            className="footer-heart"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart size={14} fill="currentColor" />
          </motion.span>{" "}
          by CagesThrottleUs &copy; Forever & always
        </motion.span>
      </footer>
    </div>
  );
}

export default FooterComponent;
