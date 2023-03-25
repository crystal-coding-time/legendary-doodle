const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/social-network",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Below will log mongo queries being executed
mongoose.set("debug", true);

module.exports = mongoose.connection;