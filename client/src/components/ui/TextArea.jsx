import { motion } from "framer-motion";

const TextArea = ({
  label,
  name,
  value,
  onChange,
  rows = 4,
  required = false,
  error = "",
  disabled = false,
  placeholder,
}) => {
  const isFocused = value && value.length > 0;

  return (
    <div className="relative w-full">
      <motion.textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 pt-6
          bg-white/50 backdrop-blur-sm
          border-2 rounded-xl
          text-gray-900
          placeholder-transparent
          transition-all duration-300
          resize-none
          focus:outline-none focus:ring-0
          ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-gray-200 focus:border-primary-500"
          }
          ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-300"
          }
        `}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      />

      {/* Floating Label */}
      <motion.label
        htmlFor={name}
        className={`
          absolute left-4 pointer-events-none
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

export default TextArea;
