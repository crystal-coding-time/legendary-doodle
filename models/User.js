const { Schema, model } = require("mongoose");

// User schema
const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: "Username is Required",
    },

    email: {
      type: String,
      unique: true,
      required: "Email is Required",
      match: [/.+@.+\..+/],
    },

    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],

    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    // Use toJSON option to include virtual properties when data is requested
    toJSON: {
      virtuals: true,
    },
    // Use id: false to prevent default virtual getter from creating "id" field
    id: false,
  }
);

// Virtual property to get the friend count
UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// Create the User model using the UserSchema
const User = model("User", UserSchema);

// Export the User model
module.exports = User;
