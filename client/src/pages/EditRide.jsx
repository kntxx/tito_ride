import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getRide, updateRide } from "../services/rideService";
import { useAuth } from "../hooks/useAuth";
import InputField from "../components/ui/InputField";
import TextArea from "../components/ui/TextArea";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";

const EditRide = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    meetupTime: "",
    meetupLocation: "",
    rideType: "Chill",
    routeLocation: "",
    gpxLink: "",
    description: "",
    maxRiders: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchRideData();
  }, [id, isAuthenticated]);

  const fetchRideData = async () => {
    try {
      const ride = await getRide(id);

      // Check if current user is the creator
      if (ride.creator.userId !== user._id) {
        alert("You are not authorized to edit this ride");
        navigate(`/ride/${id}`);
        return;
      }

      // Format datetime for input
      const formattedTime = ride.meetupTime
        ? new Date(ride.meetupTime).toISOString().slice(0, 16)
        : "";

      setFormData({
        title: ride.title || "",
        meetupTime: formattedTime,
        meetupLocation: ride.meetupLocation || "",
        rideType: ride.rideType || "Chill",
        routeLocation: ride.routeLocation || "",
        gpxLink: ride.gpxLink || "",
        description: ride.description || "",
        maxRiders: ride.maxRiders || "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load ride details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const rideData = {
        ...formData,
        maxRiders: formData.maxRiders
          ? parseInt(formData.maxRiders)
          : undefined,
      };

      await updateRide(id, rideData);
      navigate(`/ride/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update ride");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen pb-16">
      <PageHeader
        title="Edit Ride"
        subtitle="Update your mountain bike adventure details"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <Card variant="glass" className="p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card border-red-300 bg-red-50/50 p-4 rounded-xl mb-6"
            >
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0"
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
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Title - Full Width */}
            <InputField
              label="Ride Title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              icon={
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
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              }
            />

            {/* Row 2: Date/Time, Ride Type, Max Riders - 3 Columns */}
            <div className="grid md:grid-cols-3 gap-6">
              <InputField
                label="Meetup Date & Time"
                type="datetime-local"
                name="meetupTime"
                value={formData.meetupTime}
                onChange={handleChange}
                required
                icon={
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
              />

              <Select
                label="Ride Type"
                name="rideType"
                value={formData.rideType}
                onChange={handleChange}
                required
                options={[
                  { value: "Chill", label: "Chill - Relaxed pace" },
                  { value: "Race Pace", label: "Race Pace - Fast & intense" },
                ]}
                icon={
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                }
              />

              <InputField
                label="Max Riders"
                type="number"
                name="maxRiders"
                value={formData.maxRiders}
                onChange={handleChange}
                min="1"
                icon={
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                }
              />
            </div>

            {/* Row 3: Meetup Location - Full Width */}
            <InputField
              label="Meetup Location"
              type="text"
              name="meetupLocation"
              value={formData.meetupLocation}
              onChange={handleChange}
              required
              icon={
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
            />

            {/* Row 4: Route Location & GPX Link - 2 Columns */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="Route Location"
                type="text"
                name="routeLocation"
                value={formData.routeLocation}
                onChange={handleChange}
                icon={
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
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                }
              />

              <InputField
                label="GPX Link"
                type="url"
                name="gpxLink"
                value={formData.gpxLink}
                onChange={handleChange}
                icon={
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
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                }
              />
            </div>

            {/* Row 5: Description - Full Width */}
            <TextArea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
            />

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={submitting}
                className="flex-1"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate(`/ride/${id}`)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass-card bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-2xl p-6 border border-blue-200/50"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center text-white text-xl">
              ✏️
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-3 text-lg">
                Editing Your Ride
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>All participants will see the updated information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Consider notifying participants of major changes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>
                    Changing time or location? Make sure everyone knows
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditRide;
