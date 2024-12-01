const express = require('express')
const router = express.Router()
const { registerUser } = require('../controllers/userController')

// Detta är själva routen/endpointen där vi kallar på funktionen i controllers.
// Kör jag en post-request mot denna endpoint kallar vi på registerUser-funktionen 
// och den kommer försöka ta data från requestet och spara användaren i DB. 
// Det är denna endpoint vi importerar i vår index.js

router.post('/', registerUser)

module.exports = router