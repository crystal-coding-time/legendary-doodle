// Import the Thought and User models from "../models"
const { Thought, User } = require("../models");

// Define the thought controller object
const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    // Find all thoughts and populate their reactions with their respective data except the __v field
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v") // Exclude the __v field from the thoughts
      .sort({ _id: -1 }) // Sort thoughts by descending _id field
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Get one thought by id
  getThoughtById({ params }, res) {
    // Find a thought by its _id field and populate its reactions with their respective data except the __v field
    Thought.findOne({ _id: params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v") // Exclude the __v field from the thought
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No thought with this id!" });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Create thought
  createThought({ params, body }, res) {
    // Create a new thought with the given data
    Thought.create(body)
      .then(({ _id }) => {
        // Add the created thought's _id to the associated user's thoughts array field
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        }

        res.json({ message: "Thought successfully created!" });
      })
      .catch((err) => res.json(err));
  },

  // Update thought by id
  updateThought({ params, body }, res) {
    // Find a thought by its _id field and update it with the given data
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true, // Return the updated thought
      runValidators: true, // Validate the updates against the model's schema
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // Delete thought
  deleteThought({ params }, res) {
    // Find a thought by its _id field and delete it
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
            res.status(404).json({ message: "No thought with this id" });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch((err) => res.json(err));
    },
  
    // Delete reaction
    removeReaction({ params }, res) {
      Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      )
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => res.json(err));
    },
  };
  
  module.exports = thoughtController;