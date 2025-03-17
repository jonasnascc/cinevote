const router = require('express').Router()

const PlaylistPosController = require("../controllers/PlaylistPosController")

router.post("/", PlaylistPosController.create);
router.get("/", PlaylistPosController.list);
router.get("/:id", PlaylistPosController.getById);
router.put("/:id", PlaylistPosController.update);

module.exports = router;