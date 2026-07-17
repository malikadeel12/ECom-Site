import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export const Reveal = ({ children, delay = 0, y = 40, className = "", ...rest }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 1, delay, ease: EASE }}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

export const MaskReveal = ({ children, delay = 0, className = "" }) => (
  <motion.span
    className={`inline-block overflow-hidden align-bottom ${className}`}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
  >
    <motion.span
      className="inline-block"
      variants={{
        hidden: { y: "110%" },
        visible: { y: 0, transition: { duration: 1.1, delay, ease: EASE } },
      }}
    >
      {children}
    </motion.span>
  </motion.span>
);

export { EASE };
