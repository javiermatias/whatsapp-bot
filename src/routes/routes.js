const express = require("express");
const router = express.Router();

const whatsappController = require("../controllers/whatsapp.controller");

router.get("/", whatsappController.verifyToken).post("/", whatsappController.receiveMessage)


module.exports = router