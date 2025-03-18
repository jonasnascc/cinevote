const router = require('express').Router()

const PlaylistItemController = require("../controllers/PlaylistItemController")

router.post("/", PlaylistItemController.create);
router.get("/", PlaylistItemController.list);
router.get("/:id", PlaylistItemController.getById);
router.put("/:id", PlaylistItemController.update);

module.exports = router;