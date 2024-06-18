const express = require("express");
const router = express.Router();

const whatsappController = require("../controllers/whatsapp.controller");

router.get("/", whatsappController.verifyToken).post("/", whatsappController.receiveMessage)

router.get("/test", whatsappController.test)
module.exports = router