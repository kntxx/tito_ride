import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRide,
  joinRide,
  unjoinRide,
  deleteRide,
} from "../services/rideService";
import { getComments, addComment } from "../services/commentService";
import { useAuth } from "../hooks/useAuth";
import { formatRideDate, isRidePast } from "../utils/dateHelpers";
import CommentItem from "../components/CommentItem";
import LoadingSpinner from "../components/LoadingSpinner";
import Avatar from "../components/ui/Avatar";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [ride, setRide] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchRideDetails();
    fetchComments();
  }, [id]);

  const fetchRideDetails = async () => {
    try {
      const data = await getRide(id);
      setRide(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load ride details");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getComments(id);
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleJoin = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const isUserJoined = ride.participants.some((p) => p.userId === user._id);
      if (isUserJoined) {
        await unjoinRide(id);
      } else {
        await joinRide(id);
      }
      fetchRideDetails();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update ride");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !isAuthenticated) return;

    try {
      setSubmittingComment(true);
      await addComment(id, commentText);
      setCommentText("");
      fetchComments();
    } catch (err) {
      alert("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteRide = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this ride? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteRide(id);
      alert("Ride deleted successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete ride");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!ride) return <div className="text-center py-12">Ride not found</div>;

  const isUserJoined =
    user && ride.participants.some((p) => p.userId === user._id);
  const isPast = isRidePast(ride.meetupTime);
  const isFull = ride.maxRiders && ride.participants.length >= ride.maxRiders;
  const isCreator = user && ride.creator.userId === user._id;

  const getRideDifficulty = () => {
    return ride.rideType === "Race Pace" ? "Hard" : "Moderate";
  };

  const rideRules = [
    "🪖 Helmet is mandatory",
    "💧 Bring adequate hydration",
    "🔧 Check your bike before the ride",
    "📱 Carry a phone for emergencies",
    "🤝 Respect other trail users",
    "🌲 Stay on designated trails",
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {ride.title}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                ride.rideType === "Race Pace"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {ride.rideType}
            </span>
          </div>
          <div className="flex space-x-2">
            {isAuthenticated && !isPast && !isCreator && (
              <button
                onClick={handleToggleJoin}
                disabled={isFull && !isUserJoined}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isUserJoined
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : isFull
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                }`}
              >
                {isUserJoined ? "✓ Going" : isFull ? "Ride Full" : "GO to Ride"}
              </button>
            )}
            {isCreator && (
              <>
                <button
                  onClick={() => navigate(`/rides/${id}/edit`)}
                  className="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  ✏️ Edit Ride
                </button>
                <button
                  onClick={handleDeleteRide}
                  className="px-6 py-3 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  🗑️ Delete Ride
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              📅 Petsa & Oras
            </h3>
            <p className="text-gray-700 text-[16px]">
              {formatRideDate(ride.meetupTime)}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              📍 Meetup Location
            </h3>
            <p className="text-gray-700">{ride.meetupLocation}</p>
          </div>
          {ride.routeLocation && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                🗺️ Route Location
              </h3>
              <p className="text-gray-700">{ride.routeLocation}</p>
            </div>
          )}
          {ride.gpxLink && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📊 GPX Track</h3>
              <a
                href={ride.gpxLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                View GPX File
              </a>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">💪 Difficulty</h3>
            <p className="text-gray-700">{getRideDifficulty()}</p>
          </div>
          {ride.maxRiders && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">👥 Capacity</h3>
              <p className="text-gray-700">
                {ride.participants.length} / {ride.maxRiders} riders
              </p>
            </div>
          )}
        </div>

        {ride.description && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">📝 Description</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {ride.description}
            </p>
          </div>
        )}
      </div>

      {/* Participants */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Riders Going ({ride.participants.length})
        </h2>
        {ride.participants.length === 0 ? (
          <p className="text-gray-500">No riders yet. Be the first to join!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ride.participants.map((participant, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Avatar
                  src={participant.profileImage}
                  alt={participant.name}
                  size="md"
                  className="ring-2 ring-white shadow-md"
                />
                <p className="font-medium text-gray-900">{participant.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comments/Reminders */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          💬 Reminders & Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a reminder or comment..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none h-24"
              disabled={submittingComment}
            />
            <button
              type="submit"
              disabled={!commentText.trim() || submittingComment}
              className="mt-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submittingComment ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <p className="text-gray-500 mb-6">
            <a href="/login" className="text-primary-600 hover:underline">
              Login
            </a>{" "}
            to add comments
          </p>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500">
              No comments yet. Start the conversation!
            </p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUserId={user?._id}
                onDelete={() => {}}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
