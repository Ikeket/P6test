const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", auth, stuffCtrl.getAllSauce);
router.post("/", auth, multer, stuffCtrl.createSauce);
router.get("/:id", auth, stuffCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
// ajouter route like router.post('./:id/like', auth, sauceCtrl.like);

module.exports = router;
