import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { getUserProfile, updateUserProfile } from "../services/userService";
import ProfileImageUploader from "../components/ProfileImageUploader";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import Select from "../components/ui/Select";
import LoadingSpinner from "../components/LoadingSpinner";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bikeType: "",
    mtbLevel: "",
    emergencyContact: {
      name: "",
      phone: "",
    },
  });

  const isOwnProfile = currentUser && currentUser._id === id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile(id);
      setProfile(data);
      setFormData({
        name: data.name,
        bikeType: data.bikeType,
        mtbLevel: data.mtbLevel,
        emergencyContact: data.emergencyContact,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const response = await updateUserProfile(id, formData);

      if (response.success) {
        setProfile(response.user);
        setEditing(false);

        // Update auth context if editing own profile
        if (isOwnProfile) {
          updateUser(response.user);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageUpdate = (newImageUrl) => {
    setProfile((prev) => ({ ...prev, profileImage: newImageUrl }));

    // Update auth context if own profile
    if (isOwnProfile) {
      updateUser({ ...currentUser, profileImage: newImageUrl });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!profile)
    return <div className="text-center py-12">Profile not found</div>;

  return (
    <div className="min-h-screen pb-16">
      <PageHeader
        title={profile.name}
        subtitle={`${profile.mtbLevel} • ${profile.bikeType} Rider`}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 text-black">
        {/* Profile Image Section */}
        {isOwnProfile && (
          <Card variant="glass" className="p-8 mb-6 border border-[#26433C]">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
              <span className="mr-3 text-3xl">🖼️</span>
              Profile Picture
            </h2>
            <ProfileImageUploader
              userId={id}
              currentImage={profile.profileImage}
              onUploadSuccess={handleProfileImageUpdate}
            />
          </Card>
        )}

        {/* Profile Info */}
        <Card variant="glass" className="p-8 border ">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-black flex items-center">
              <span className="mr-3 text-3xl ">👤</span>
              Profile Information
            </h2>

            {isOwnProfile && !editing && (
              <Button
                onClick={() => setEditing(true)}
                variant="primary"
                size="sm"
                icon={(props) => (
                  <svg
                    {...props}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                )}
              >
                Edit Profile
              </Button>
            )}
          </div>

          {editing ? (
            /* Edit Mode */
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
              />

              <div className="grid md:grid-cols-2 gap-6">
                <Select
                  label="Bike Type"
                  name="bikeType"
                  value={formData.bikeType}
                  onChange={handleChange}
                  required
                  options={[
                    { value: "XC", label: "XC - Cross Country" },
                    { value: "Trail", label: "Trail" },
                    { value: "Enduro", label: "Enduro" },
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

                <Select
                  label="MTB Level"
                  name="mtbLevel"
                  value={formData.mtbLevel}
                  onChange={handleChange}
                  required
                  options={[
                    { value: "Beginner", label: "Beginner" },
                    { value: "Intermediate", label: "Intermediate" },
                    { value: "Advanced", label: "Advanced" },
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
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  }
                />
              </div>

              <div className="pt-4 border-t border-[#26433C]">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <span className="mr-2 text-xl">🚨</span>
                  Emergency Contact
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    label="Contact Name"
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleChange}
                    required
                  />

                  <InputField
                    label="Contact Phone"
                    type="tel"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={saving}
                  className="flex-1"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: profile.name,
                      bikeType: profile.bikeType,
                      mtbLevel: profile.mtbLevel,
                      emergencyContact: profile.emergencyContact,
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <InfoCard icon="👤" label="Full Name" value={profile.name} />
                <InfoCard icon="📧" label="Email" value={profile.email} />
                <InfoCard
                  icon="🚴"
                  label="Bike Type"
                  value={profile.bikeType}
                />
                <InfoCard
                  icon="⭐"
                  label="MTB Level"
                  value={profile.mtbLevel}
                />
              </div>

              <div className="pt-6 border-t border-[#26433C]">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <span className="mr-2 text-xl">🚨</span>
                  Emergency Contact
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InfoCard
                    icon="👤"
                    label="Contact Name"
                    value={profile.emergencyContact.name}
                  />
                  <InfoCard
                    icon="📞"
                    label="Contact Phone"
                    value={profile.emergencyContact.phone}
                  />
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-4 rounded-xl text-black  border border-gray-200"
  >
    <div className="flex items-center space-x-3">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-gray font-medium">{value}</p>
      </div>
    </div>
  </motion.div>
);

export default Profile;
