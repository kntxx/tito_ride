import { motion } from "framer-motion";
import { useState } from "react";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = " ",
  icon: Icon,
  required = false,
  error,
  disabled = false,
  className = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative ${className}`}
    >
      <div className="relative group">
        {/* Icon */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300 z-10">
            {typeof Icon === "function" ? <Icon className="w-5 h-5" /> : Icon}
          </div>
        )}

        {/* Input */}
        <motion.input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className={`
            peer w-full px-4 py-4 ${Icon ? "pl-12" : "pl-4"} pr-4
            bg-white/80 backdrop-blur-sm
            rounded-2xl border-2 border-gray-200/50
            text-gray-900 text-base
            placeholder:text-transparent
            focus:border-primary-400 focus:ring-4 focus:ring-primary-100/50
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-all duration-300 outline-none
            shadow-sm hover:shadow-md focus:shadow-lg
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : ""
            }
          `}
          {...props}
        />

        {/* Floating Label */}
        <motion.label
          htmlFor={name}
          initial={false}
          animate={{
            top: isFocused || value ? "0.5rem" : "50%",
            left: Icon && !(isFocused || value) ? "3rem" : "1rem",
            fontSize: isFocused || value ? "0.75rem" : "1rem",
            translateY: isFocused || value ? "0" : "-50%",
          }}
          transition={{ duration: 0.2 }}
          className={`
            absolute pointer-events-none
            font-medium transition-colors duration-300
            ${
              isFocused || value
                ? error
                  ? "text-red-500"
                  : "text-primary-600"
                : "text-gray-500"
            }
          `}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </motion.label>

        {/* Focus Ring Glow */}
        {isFocused && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400/20 to-emerald-400/20 blur-xl -z-10"
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default InputField;
