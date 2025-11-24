import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getRides, joinRide, unjoinRide } from "../services/rideService";
import { useAuth } from "../hooks/useAuth";
import RideCard from "../components/RideCard";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/ui/PageHeader";
import Section from "../components/ui/Section";
import Button from "../components/ui/Button";

const Home = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("upcoming"); // upcoming, past, all
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const data = await getRides();
      setRides(data);
      setError("");
    } catch (err) {
      setError("Failed to load rides");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleJoin = async (rideId, isJoined) => {
    try {
      if (isJoined) {
        await unjoinRide(rideId);
      } else {
        await joinRide(rideId);
      }
      // Refresh rides after join/unjoin
      fetchRides();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update ride");
    }
  };

  const filterRides = () => {
    const now = new Date();
    if (filter === "upcoming") {
      return rides.filter((ride) => new Date(ride.meetupTime) >= now);
    } else if (filter === "past") {
      return rides.filter((ride) => new Date(ride.meetupTime) < now);
    }
    return rides;
  };

  const filteredRides = filterRides();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Header */}
   

      <Section>
        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12 "
        >
          {["upcoming", "past", "all"].map((filterType) => (
            <motion.button
              key={filterType}
              onClick={() => setFilter(filterType)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-6 py-2.5 rounded-full font-medium capitalize
                transition-all duration-300
                ${
                  filter === filterType
                    ? "bg-gradient-premium text-white shadow-glow"
                    : "glass-card text-gray-700 hover:border-primary-300"
                }
              `}
            >
              {filterType} Rides
            </motion.button>
          ))}
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card border-red-300 bg-red-50/50 p-4 rounded-2xl mb-8 max-w-2xl mx-auto "
          >
            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Rides Grid or Empty State */}
        {filteredRides.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-purple-100 mb-6">
              <svg
                className="w-12 h-12 text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {filter === "upcoming"
                ? "No upcoming rides yet"
                : "No rides found"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filter === "upcoming"
                ? "Be the first to create an epic ride and gather the community!"
                : "Try adjusting your filters or create a new ride."}
            </p>
            {isAuthenticated && (
              <Link to="/create-ride">
                <Button variant="primary" size="lg">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create First Ride
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRides.map((ride, index) => (
              <motion.div
                key={ride._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <RideCard ride={ride} onToggleJoin={handleToggleJoin} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Section>

    </div>
  );
};

export default Home;
