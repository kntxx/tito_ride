import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatRideDate, isRidePast } from "../utils/dateHelpers";
import { useAuth } from "../hooks/useAuth";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import Avatar from "./ui/Avatar";

const RideCard = ({ ride, onToggleJoin }) => {
  const { user, isAuthenticated } = useAuth();

  const isUserJoined =
    user && ride.participants.some((p) => p.userId === user._id);

  const isPast = isRidePast(ride.meetupTime);
  const isFull = ride.maxRiders && ride.participants.length >= ride.maxRiders;
  const isCreator = user && ride.creator.userId === user._id;

  const getRideTypeVariant = () => {
    return ride.rideType === "Race Pace" ? "danger" : "info";
  };

  const handleJoinClick = (e) => {
    e.preventDefault();
    if (isAuthenticated && !isPast) {
      onToggleJoin(ride._id, isUserJoined);
    }
  };

  return (
    <Card variant="glass" className="overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4 h-[150p]">
        <div className="flex-1 ">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gradient transition-all duration-300">
            {ride.title}
          </h3>

          {/* Location */}
          <div className="flex items-center space-x-2 text-gray-600 mb-2 ">
            <svg
              className="w-4 h-4 text-primary-500"
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
            <span className="text-sm">{ride.meetupLocation}</span>
          </div>

          {/* Time */}
          <div className="flex items-center space-x-2 text-gray-600">
            <svg
              className="w-4 h-4 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">{formatRideDate(ride.meetupTime)}</span>
          </div>
        </div>

        {/* Ride Type Badge */}
        <Badge variant={getRideTypeVariant()} size="sm">
          {ride.rideType}
        </Badge>
      </div>

      {/* Description */}
      {ride.description && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">
          {ride.description}
        </p>
      )}

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

      {/* Footer Section */}
      <div className="flex items-center justify-between ">
        {/* Participants */}
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-3">
            {ride.participants.slice(0, 3).map((participant, index) => (
              <Avatar
                key={index}
                src={participant.profileImage}
                alt={participant.name}
                size="sm"
                className="ring-2 ring-white"
              />
            ))}
            {ride.participants.length > 3 && (
              <div className="h-8 w-8 rounded-full bg-gradient-premium flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                +{ride.participants.length - 3}
              </div>
            )}
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-900">
              {ride.participants.length}
            </span>
            <span className="text-gray-500 ml-1">
              {ride.participants.length === 1 ? "rider" : "riders"}
            </span>
            {ride.maxRiders && (
              <span className="text-gray-400"> / {ride.maxRiders}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {isAuthenticated && !isPast && (
            <>
              {isCreator ? (
                <Link to={`/rides/${ride._id}/edit`}>
                  <Button
                    variant="secondary"
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
                    Edit
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleJoinClick}
                  disabled={isFull && !isUserJoined}
                  variant={isUserJoined ? "secondary" : "primary"}
                  size="sm"
                  icon={
                    isUserJoined
                      ? (props) => (
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )
                      : null
                  }
                >
                  {isUserJoined ? "Going" : isFull ? "Full" : "Join"}
                </Button>
              )}
            </>
          )}

          <Link to={`/ride/${ride._id}`}>
            <Button variant="outline" size="sm">
              Details
            </Button>
          </Link>
        </div>
      </div>

      {/* Past Ride Banner */}
      {isPast && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <Badge variant="default" size="sm" className="w-full justify-center">
            Ride Completed
          </Badge>
        </motion.div>
      )}
    </Card>
  );
};

export default RideCard;
