import { motion } from "framer-motion";
import { formatCommentDate } from "../utils/dateHelpers";
import Avatar from "./ui/Avatar";
import Button from "./ui/Button";

const CommentItem = ({ comment, currentUserId, onDelete }) => {
  const isOwner = currentUserId === comment.userId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex space-x-4 p-5 glass-card rounded-2xl border border-white/20 hover:border-primary-200/50 transition-all duration-300"
    >
      <Avatar src={comment.profileImage} alt={comment.name} size="md" glow />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-semibold text-gray-900">{comment.name}</p>
            <div className="flex items-center space-x-2 mt-1">
              <svg
                className="w-3 h-3 text-gray-400"
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
              <p className="text-xs text-gray-500">
                {formatCommentDate(comment.createdAt)}
              </p>
            </div>
          </div>

          {isOwner && (
            <Button
              onClick={() => onDelete(comment._id)}
              variant="ghost"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            />
          )}
        </div>

        <p className="text-gray-700 leading-relaxed break-words">
          {comment.text}
        </p>

        {/* Gradient Accent Line */}
        <div className="mt-3 h-0.5 w-12 bg-gradient-premium rounded-full opacity-50"></div>
      </div>
    </motion.div>
  );
};

export default CommentItem;
