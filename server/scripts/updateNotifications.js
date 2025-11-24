const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const User = require("../models/User");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const updateNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get all notifications
    const notifications = await Notification.find({});
    console.log(`Found ${notifications.length} notifications to update`);

    let updated = 0;
    let skipped = 0;

    for (const notification of notifications) {
      // Get the user who triggered the notification
      const user = await User.findById(notification.triggeredBy?.userId);

      if (user && notification.triggeredBy) {
        console.log(`\nNotification ${notification._id}:`);
        console.log(`  User: ${user.name}`);
        console.log(
          `  Current profileImage in notification: ${notification.triggeredBy.profileImage}`
        );
        console.log(`  User's actual profileImage: ${user.profileImage}`);

        // Always update to user's current profileImage
        notification.triggeredBy.profileImage = user.profileImage;
        await notification.save();
        updated++;
      } else {
        skipped++;
      }
    }

    console.log(`\nUpdate complete:`);
    console.log(`- Updated: ${updated} notifications`);
    console.log(
      `- Skipped: ${skipped} notifications (already had profileImage)`
    );
    console.log(`- Total: ${notifications.length} notifications`);

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Error updating notifications:", error);
    process.exit(1);
  }
};

updateNotifications();
