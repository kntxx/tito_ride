import { motion } from "framer-motion";

const Card = ({
  children,
  variant = "glass",
  hover = true,
  className = "",
  ...props
}) => {
  const variants = {
    glass: "backdrop-blur-xl bg-white/70 border border-white/20 shadow-glass",
    solid: "bg-white border border-gray-200/50 shadow-lg",
    gradient:
      "bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 shadow-xl",
    dark: "backdrop-blur-xl bg-gray-900/40 border border-white/10 shadow-glass text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      className={`
        rounded-3xl p-6 md:p-8
        ${variants[variant]}
        ${hover ? "transition-all duration-500 hover:shadow-premium" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
