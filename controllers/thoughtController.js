const { User, Thought } = require("../models");

const handleResponse = (res, data, message) => {
  if (!data) {
    return res.status(404).json({ message });
  }
  return res.json(data);
};

const handleError = (res, err) => {
  return res.status(500).json(err);
};

module.exports = {
  // Get all thoughts
  getThought(req, res) {
    Thought.find({})
      .then((thought) => res.json(thought))
      .catch((err) => handleError(res, err));
  },

  // Get single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) => handleResponse(res, thought, "No Thought found with this ID!"))
      .catch((err) => handleError(res, err));
  },

  // Create a thought and push the created thought's _id to the associated user's thoughts array field
  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((thought) => handleResponse(res, thought, "No User found with this ID!"))
      .catch((err) => handleError(res, err));
  },

  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, New: true }
    )
      .then((thought) => handleResponse(res, thought, "No thought found with this ID!"))
      .catch((err) => handleError(res, err));
  },

  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((deletedThought) => {
        if (!deletedThought) {
          return Promise.reject({ customMessage: "No thought found with this ID!" });
        }
        return User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
      })
      .then((user) => handleResponse(res, user, "Thought deleted, but no user found"))
      .catch((err) => {
        if (err.customMessage) {
          return res.status(404).json({ message: err.customMessage });
        }
        handleError(res, err);
      });
  },

  // Create reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) => handleResponse(res, thought, "No thought found with ID!"))
      .catch((err) => handleError(res, err));
  },

  // Delete reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) => handleResponse(res, thought, "No thought found with this ID!"))
      .catch((err) => handleError(res, err));
  },
};
