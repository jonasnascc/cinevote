const router = require('express').Router()

const PlaylistController = require("../controllers/PlaylistController")

router.post("/", PlaylistController.create);
router.get("/", PlaylistController.list);
router.get("/:id", PlaylistController.getById);
router.put("/:id", PlaylistController.update);
router.delete("/:id", PlaylistController.delete);
router.delete("/:id/guests/:guestId", PlaylistController.deleteGuest);

router.get("/inviteCode/:inviteCode", PlaylistController.getByInviteCode);
router.get("/inviteCode/:inviteCode/guests", PlaylistController.listGuests);
router.post("/inviteCode/:inviteCode/join", PlaylistController.join);
router.post("/inviteCode/:inviteCode/leave", PlaylistController.deleteGuest);

module.exports = router;
