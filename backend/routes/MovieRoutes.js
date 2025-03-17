const router = require('express').Router()

const MovieController = require("../controllers/MovieController")

router.post("/", MovieController.create);
router.get("/", MovieController.list);
router.get("/:id", MovieController.getById);
router.put("/:id", MovieController.update);

module.exports = router;