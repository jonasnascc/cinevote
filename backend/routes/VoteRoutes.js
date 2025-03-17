const router = require('express').Router()

const VoteController = require("../controllers/VoteController")

router.post("/", VoteController.create);
router.get("/", VoteController.list);
router.get("/:id", VoteController.getById);
router.put("/:id", VoteController.update);

module.exports = router;