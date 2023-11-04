const { User, Thought } = require("../models");

// Helper function to send not found response
const sendNotFoundResponse = (res, entityType) =>
  res.status(404).json({ message: `No ${entityType} found with this ID!` });

module.exports = {
  // Get all thoughts
  async getThought(req, res) {
    try {
      const thoughts = await Thought.find({});
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get single thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId }).select("-__v");
      thought ? res.json(thought) : sendNotFoundResponse(res, 'Thought');
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a thought and push the created thought's _id to the associated user's thoughts array field
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );

      user ? res.json(user) : sendNotFoundResponse(res, 'User');
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      thought ? res.json(thought) : sendNotFoundResponse(res, 'Thought');
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
      if (!thought) return sendNotFoundResponse(res, 'Thought');

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      res.json({ message: 'Thought successfully deleted' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create reaction
  async createReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      thought ? res.json(thought) : sendNotFoundResponse(res, 'Thought');
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete reaction
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      thought ? res.json(thought) : sendNotFoundResponse(res, 'Thought');
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
