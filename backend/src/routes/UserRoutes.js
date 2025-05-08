const router = require('express').Router()

const UserController = require("../controllers/UserController")
const PlaylistController = require("../controllers/PlaylistController")

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout)
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.updateUser);
router.get("/:userId/playlists", PlaylistController.listByUser)

module.exports = router;
