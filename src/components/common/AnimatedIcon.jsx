// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export const AnimatedIcon = ({ open, size }) => (
  <motion.svg
    className={`w-[${size}px] h-[${size}px] flex-none`}
    viewBox="0 0 48 48"
    fill="none"
    initial={false}
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    whileHover={{ scale: 1.1 }} // pop effect
    style={{ cursor: "pointer" }}
  >
    <motion.rect
      width="48"
      height="48"
      rx="24"
      animate={{ fill: open ? "#0c7bb3" : "#CCCCCC" }}
      whileHover={{ fill: open ? "#174bb0" : "#b3b3b3" }}
      transition={{ duration: 0.3 }}
    />
    {/* Horizontal line */}
    <motion.path
      d="M33 24H15"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Vertical line */}
    <motion.path
      d="M24 15V33"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      initial={false}
      animate={{ rotate: open ? 90 : 0, opacity: open ? 0 : 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ originX: "50%", originY: "50%" }}
    />
  </motion.svg>
);
