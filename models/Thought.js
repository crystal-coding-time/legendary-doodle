const mongoose = require("mongoose");
const dateFormat = require("../utils/dateFormat");

// Create Reaction Schema
const ReactionSchema = new mongoose.Schema(
  {
    // Reaction ID with default value set to a new Object ID
    reactionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    // Reaction body with maximum length of 280 characters
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    // Username of the user who created the reaction
    username: {
      type: String,
      required: true,
    },
    // Timestamp of when the reaction was created
    createdAt: {
      type: Date,
      default: Date.now,
      // Format the timestamp on query using the dateFormat function
      get: (timestamp) => dateFormat(timestamp),
    },
  },
  {
    // Include getters for the toJSON function and exclude ID from output
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// Create Thought Schema
const ThoughtSchema = new mongoose.Schema(
  {
    // Text of the thought with minimum length of 1 and maximum length of 280 characters
    thoughtText: {
      type: String,
      required: "Thought is Required",
      minlength: 1,
      maxlength: 280,
    },
    // Timestamp of when the thought was created
    createdAt: {
      type: Date,
      default: Date.now,
      // Format the timestamp on query using the dateFormat function
      get: (timestamp) => dateFormat(timestamp),
    },
    // Username of the user who created the thought
    username: {
      type: String,
      required: true,
    },
    // Array of nested documents created with the ReactionSchema
    reactions: [ReactionSchema],
  },
  {
    // Include virtuals and getters for the toJSON function and exclude ID from output
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Create virtual property for the number of reactions associated with a thought
ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// Create Thought model based on the ThoughtSchema
const Thought = mongoose.model("Thought", ThoughtSchema);

// Export Thought model
module.exports = Thought;
