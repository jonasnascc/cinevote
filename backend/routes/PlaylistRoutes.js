const router = require('express').Router()

const PlaylistController = require("../controllers/PlaylistController")

router.post("/", PlaylistController.create);
router.get("/", PlaylistController.list);
router.get("/:id", PlaylistController.getById);
router.put("/:id", PlaylistController.update);

module.exports = router;
