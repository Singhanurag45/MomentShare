import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate("sender", "username profilePicture")
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true }
    );
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
