import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const MagneticButton = ({ children, className = "", strength = 0.25, ...rest }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.2 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.2 });

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
};
