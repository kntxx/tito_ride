import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  href,
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  const variants = {
    primary: `
      bg-gradient-to-r from-primary-500 via-primary-600 to-emerald-500
      bg-size-200 bg-pos-0 hover:bg-pos-100
      text-white shadow-lg hover:shadow-glow
    `,
    secondary: `
      backdrop-blur-md bg-white/60 border-2 border-white/40
      text-gray-800 hover:bg-white/80 shadow-md hover:shadow-xl
    `,
    outline: `
      border-2 border-primary-500 bg-transparent
      text-primary-600 hover:bg-primary-500 hover:text-white
      shadow-md hover:shadow-glow
    `,
    glass: `
      backdrop-blur-xl bg-white/30 border border-white/20
      text-gray-900 hover:bg-white/50 shadow-glass
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      text-white shadow-lg hover:shadow-red-500/50
    `,
    ghost: `
      bg-transparent hover:bg-gray-100
      text-gray-700 hover:text-gray-900
    `,
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const Component = href ? motion(Link) : motion.button;
  const componentProps = href ? { to: href } : { type, onClick };

  return (
    <Component
      {...componentProps}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        relative rounded-full font-semibold
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        transition-all duration-300 ease-out overflow-hidden
        disabled:hover:scale-100
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {/* Shimmer Effect */}
      {!disabled && !loading && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700" />
      )}

      {/* Loading Spinner */}
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Icon Left */}
      {Icon && iconPosition === "left" && !loading && (
        <Icon className="w-5 h-5" />
      )}

      {/* Button Text */}
      <span className="relative z-10">{children}</span>

      {/* Icon Right */}
      {Icon && iconPosition === "right" && !loading && (
        <Icon className="w-5 h-5" />
      )}
    </Component>
  );
};

export default Button;
