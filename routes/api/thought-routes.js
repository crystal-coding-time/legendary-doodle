const router = require("express").Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require("../../controllers/thought-controller");

// api/thoughts
router.route("/").get(getAllThoughts).post(createThought);

// function getAllThought(req, res) {
//   // code to retrieve all thoughts
//   res.send('All thoughts retrieved!');
// }
// router.get('/', getAllThought);

// function createThought(req, res) {
//   // code to create a new thought
//   res.send('Thought created!');
// }
// router.post('/', createThought);



// /api/thoughts/:id
router
  .route("/:id")
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reactions").post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

module.exports = router;