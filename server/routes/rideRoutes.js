const express = require("express");
const router = express.Router();
const {
  createRide,
  getRides,
  getRideById,
  joinRide,
  unjoinRide,
  updateRide,
  deleteRide,
} = require("../controllers/rideController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createRide).get(getRides);

router
  .route("/:id")
  .get(getRideById)
  .put(protect, updateRide)
  .delete(protect, deleteRide);

router.post("/:id/join", protect, joinRide);
router.post("/:id/unjoin", protect, unjoinRide);

module.exports = router;
