const express = require('express');
const router = express.Router();

const {
    getUser,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
} = require('../../controllers/userController');

// Routes for /api/users
router.route('/')
  .get(getUser)       // GET all users
  .post(createUser);  // POST a new user

// Routes for /api/users/:userId
router.route('/:userId')
  .get(getSingleUser)  // GET a single user by ID
  .put(updateUser)     // PUT (update) a user by ID
  .delete(deleteUser); // DELETE a user by ID

// Routes for /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId')
  .post(addFriend)    // POST (add) a friend to a user's friend list
  .delete(deleteFriend); // DELETE a friend from a user's friend list

module.exports = router;
