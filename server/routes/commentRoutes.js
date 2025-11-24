const express = require("express");
const router = express.Router();
const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

// Comments on specific rides
router.route("/:id/comments").post(protect, addComment).get(getComments);

module.exports = router;
