const express = require('express');
const router = express.Router();

const {
  getThought,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  createReaction,
  deleteReaction
} = require('../../controllers/thoughtController');

// Routes for /api/thoughts
router.route('/')
  .get(getThought)       // GET all thoughts
  .post(createThought);  // POST a new thought

// Routes for /api/thoughts/:thoughtId
router.route('/:thoughtId')
  .get(getSingleThought)  // GET a single thought by ID
  .put(updateThought)     // PUT (update) a thought by ID
  .delete(deleteThought); // DELETE a thought by ID

// Route for /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions')
  .post(createReaction);  // POST a new reaction to a thought

// Route for /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId')
  .delete(deleteReaction);  // DELETE a reaction by ID

module.exports = router;
