import { format, isPast, isToday, isTomorrow, isThisWeek } from "date-fns";

export const formatRideDate = (date) => {
  const rideDate = new Date(date);

  if (isToday(rideDate)) {
    return `Today at ${format(rideDate, "h:mm a")}`;
  } else if (isTomorrow(rideDate)) {
    return `Tomorrow at ${format(rideDate, "h:mm a")}`;
  } else if (isThisWeek(rideDate)) {
    return format(rideDate, "EEEE 'at' h:mm a");
  } else {
    return format(rideDate, "MMM d, yyyy - h:mm a");
  }
};

export const isRidePast = (date) => {
  return isPast(new Date(date));
};

export const formatCommentDate = (date) => {
  return format(new Date(date), "MMM d, yyyy - h:mm a");
};
