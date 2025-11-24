import { motion } from "framer-motion";

const Avatar = ({
  src,
  alt = "Avatar",
  size = "md",
  glow = false,
  online = false,
  className = "",
  ...props
}) => {
  const sizes = {
    xs: "w-8 h-8",
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
    "2xl": "w-24 h-24",
  };

  // Support numeric sizes (e.g., 40 for 40px)
  const isNumericSize = typeof size === "number";
  const sizeClass = isNumericSize ? "" : sizes[size];
  const inlineStyle = isNumericSize
    ? { width: `${size}px`, height: `${size}px` }
    : {};

  // Default ring styles only if no custom className
  const defaultRingStyles =
    !className && !glow ? "ring-2 ring-white shadow-lg" : "";
  const glowStyles = glow
    ? "ring-4 ring-primary-400 ring-offset-4 ring-offset-white shadow-glow"
    : "";

  // Generate fallback avatar URL from name
  const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    alt
  )}&background=random`;

  // Prepend API URL if src is a relative path
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const fullSrc = src && src.startsWith("/") ? `${apiUrl}${src}` : src;

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
      className="relative inline-block"
      {...props}
    >
      <img
        src={fullSrc || fallbackSrc}
        alt={alt}
        style={inlineStyle}
        onError={(e) => {
          if (e.target.src !== fallbackSrc) {
            e.target.src = fallbackSrc;
          }
        }}
        className={`
          ${sizeClass} rounded-full object-cover
          ${glowStyles}
          ${defaultRingStyles}
          ${className}
          transition-all duration-300
        `}
      />

      {/* Online Indicator */}
      {online && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white ring-2 ring-green-400/50"
        >
          <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
        </motion.span>
      )}
    </motion.div>
  );
};

export default Avatar;
