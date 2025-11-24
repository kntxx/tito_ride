import { motion } from "framer-motion";

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error = "",
  disabled = false,
  icon: Icon,
}) => {
  const isFocused = value && value.length > 0;

  return (
    <div className="relative w-full">
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {typeof Icon === "function" ? <Icon className="w-5 h-5" /> : Icon}
          </div>
        )}

        <motion.select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3 pt-6
            ${Icon ? "pl-12" : "pl-4"}
            bg-white/50 backdrop-blur-sm
            border-2 rounded-xl
            text-gray-900
            appearance-none
            transition-all duration-300
            focus:outline-none focus:ring-0
            ${
              error
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 focus:border-primary-500"
            }
            ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-gray-300 cursor-pointer"
            }
          `}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </motion.select>

        {/* Dropdown Arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Floating Label */}
      <motion.label
        htmlFor={name}
        className={`
          absolute pointer-events-none z-10
          ${Icon ? "left-12" : "left-4"}
          transition-all duration-300
          ${isFocused || value ? "top-2 text-xs" : "top-4 text-base"}
          ${
            error
              ? "text-red-500"
              : isFocused
              ? "text-primary-600"
              : "text-gray-500"
          }
        `}
        animate={{
          y: isFocused || value ? 0 : 0,
          scale: isFocused || value ? 0.85 : 1,
        }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </motion.label>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Select;
