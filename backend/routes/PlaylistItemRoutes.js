const router = require('express').Router()

const PlaylistItemController = require("../controllers/PlaylistItemController")

router.post("/:playlistId/items", PlaylistItemController.create);
router.get("/:playlistId/items", PlaylistItemController.list);
router.get("/:playlistId/items/:id", PlaylistItemController.getById);
router.put("/:playlistId/items/:id", PlaylistItemController.update);
router.delete("/:playlistId/items/:id", PlaylistItemController.delete);
router.patch("/:playlistId/items/:id/updatePosition", PlaylistItemController.updatePlaylistItemPosition);
router.patch("/:playlistId/items/:id/changePlaylist", PlaylistItemController.changePlaylist);

router.post("/inviteCode/:inviteCode/items/:id/vote/:val", PlaylistItemController.vote);
router.post("/inviteCode/:inviteCode/items", PlaylistItemController.create)

module.exports = router;