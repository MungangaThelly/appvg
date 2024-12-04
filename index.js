// Här importerar vi olika npm-paket, funktioner eller variabler vi behöver komma åt. 
const express = require('express')
const connectDB = require('./config/db')
require('dotenv').config()

// Här kör vi express i variabeln app så vi sedan kan använda app för att komma åt express funktioner, vi deklarerar även PORT till 5000 via .env med backup-port på 5001.
const app = express()
const PORT = process.env.PORT || 5001

connectDB()

// Middleware som hjälper vår expressapp att hantera jsondata. 
app.use(express.json())

// Här importerar vi våra routes som vi vill att våran server ska "använda".
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/protected', require('./routes/protectedRoutes')) 

// Vår server lyssnar efter requests på PORT. Detta är även en indikator på att servern kör och fungerar. 
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})
