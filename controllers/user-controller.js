// import the User and Thought models
const { User, Thought } = require("../models");

// define an object with controller functions for each CRUD operation
const userController = {
  // get all users
  getAllUser(req, res) {
    User.find({})
      .populate({
        path: "friends",
        select: "-__v", // exclude the version field from friend documents
      })
      .select("-__v") // exclude the version field from user documents
      .sort({ _id: -1 }) // sort by descending order of MongoDB ObjectId
      .then((dbUserData) => res.json(dbUserData)) // return the user data as JSON
      .catch((err) => {
        console.log(err); // log any errors
        res.sendStatus(400); // send a 400 Bad Request status code
      });
  },

  // get one user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v", // exclude the version field from thought documents
      })
      .populate({
        path: "friends",
        select: "-__v", // exclude the version field from friend documents
      })
      .select("-__v") // exclude the version field from user documents
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "No user found with this id!" }); // send a 404 Not Found status code and message
        }
        res.json(dbUserData); // return the user data as JSON
      })
      .catch((err) => {
        console.log(err); // log any errors
        res.sendStatus(400); // send a 400 Bad Request status code
      });
  },

  // create user
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData)) // return the user data as JSON
      .catch((err) => res.json(err)); // return the error as JSON
  },

  // update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true, // return the updated document
      runValidators: true, // validate the update against the model's schema
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" }); // send a 404 Not Found status code and message
          return;
        }
        res.json(dbUserData); // return the user data as JSON
      })
      .catch((err) => res.json(err)); // return the error as JSON
  },

  // Delete a user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No user with this id!" }); // send a 404 Not Found status code and message
        }
        // delete all thoughts associated with the deleted user
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      })
      .then(() => {
        res.json({ message: "User and associated thoughts deleted!" }); // return a success message as JSON
      })
      .catch((err) => res.json(err));
    },

    // Add a friend
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user with this id" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // Delete a friend
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No user with this id!" });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
};
module.exports = userController;