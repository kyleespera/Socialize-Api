const { User, Thought } = require("../models");

// Helper function to send not found response
const sendNotFoundResponse = (res, entityType) =>
  res.status(404).json({ message: `No ${entityType} found with that ID!` });

module.exports = {
  // Get all users
  async getUser(req, res) {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate("thoughts")
        .populate("friends")
        .select("-__v");
      
      user ? res.json(user) : sendNotFoundResponse(res, 'User');
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      user ? res.json(user) : sendNotFoundResponse(res, 'User');
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a user and their associated thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      if (!user) return sendNotFoundResponse(res, 'User');

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: "User and their Thoughts deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add a friend
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      user ? res.json(user) : sendNotFoundResponse(res, 'User');
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a friend
  async deleteFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      user ? res.json(user) : sendNotFoundResponse(res, 'User');
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
