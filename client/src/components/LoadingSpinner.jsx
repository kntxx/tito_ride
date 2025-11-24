import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-transparent border-t-primary-500 border-r-primary-400"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner Ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-500 border-l-purple-400"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Center Glow */}
        <motion.div
          className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-gradient-premium"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Loading Text */}
      <motion.p
        className="text-sm font-medium text-gray-600"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
