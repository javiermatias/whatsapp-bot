const express = require("express");
const router = express.Router();

const whatsappController = require("../controllers/whatsapp.controller");

router.get("/whatsapp", whatsappController.verifyToken).post("/whatsapp", whatsappController.receiveMessage)


module.exports = router