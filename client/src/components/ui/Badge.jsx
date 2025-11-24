import { motion } from "framer-motion";

const Badge = ({
  children,
  variant = "default",
  size = "md",
  icon: Icon,
  className = "",
  ...props
}) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700",
    primary:
      "bg-gradient-to-r from-primary-100 to-emerald-100 text-primary-700",
    success: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700",
    warning: "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700",
    danger: "bg-gradient-to-r from-red-100 to-pink-100 text-red-700",
    info: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700",
    purple: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700",
    glass: "backdrop-blur-md bg-white/60 border border-white/40 text-gray-800",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={`
        inline-flex items-center gap-1.5
        rounded-full font-semibold
        shadow-sm hover:shadow-md
        transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.span>
  );
};

export default Badge;
