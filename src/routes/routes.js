const express = require("express");
const router = express.Router();
const whatsappController = require("../controllers/whatsapp.controller");
const middleWare = require("../middleware/middleware")

router.get("/", whatsappController.verifyToken).post("/", middleWare.company, whatsappController.receiveMessage)
router.get("/arcor", whatsappController.verifyToken).post("/arcor", middleWare.company, whatsappController.receiveMessage)
router.get("/test",  whatsappController.test)
module.exports = router