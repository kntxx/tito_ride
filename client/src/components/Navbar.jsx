import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";
import NotificationsBell from "./NotificationsBell";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-white/70 border-b border-white/20 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.span
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl"
            >
              🚵
            </motion.span>
            <span className="text-2xl font-bold text-gradient group-hover:scale-105 transition-transform duration-300">
              Tito Ride
            </span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="hidden md:block text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  Rides
                </Link>

                <Link to="/create-ride">
                  <Button
                    variant="primary"
                    className="w-[50px] md:w-[150px] h-10"
                  >
                    <svg
                      className="w-5 h-5 md:hidden inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="hidden md:inline">Create Ride</span>
                  </Button>
                </Link>

                {/* Notifications Bell */}
                <NotificationsBell />

                {/* User Profile */}
                <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                  <Link to={`/profile/${user._id}`}>
                    <Avatar
                      src={user.profileImage}
                      alt={user.name}
                      size="md"
                      glow
                    />
                  </Link>
                  <Link
                    to={`/profile/${user._id}`}
                    className="hidden lg:block hover:opacity-80 transition-opacity"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.mtbLevel}</p>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-red-500 transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="md">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="md">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
