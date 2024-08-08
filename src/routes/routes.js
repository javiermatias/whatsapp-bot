const express = require("express");
const router = express.Router();
const whatsappController = require("../controllers/whatsapp.controller");
const middleWare = require("../middleware/middleware")

router.get("/", whatsappController.verifyToken).post("/", whatsappController.receiveMessage)

router.get("/test", middleWare.carrefour, whatsappController.test)
module.exports = router