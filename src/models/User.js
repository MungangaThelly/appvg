const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// I denna fil skapar vi en modell för (i detta fall) user. Detta är den modell vi sedan använder för att kunna spara data i vår DB.
// Skulle vi t.ex vilja att användare ska ha ett födelsedatum vid signup behöver detta specificeras i modellen här.

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

// Detta är en funktion som körs när man försöker spara en ny användare i vår DB. Den krypterar lösenordet med hjälp av bcrypt.
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

module.exports = mongoose.model('User', UserSchema)

