const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    created: { type: Date, default: Date.now }
});

//Ao criar usuário, vai passar por esse pre-save, para criptografar a senha
UserSchema.pre('save', async function (next) {
    let user = this;
    if (!user.isModified('password')) return next(); //se o usuário não for modificado no campo password, vai criptografar

    user.password = await bcrypt.hash(user.password, 10);
    return next();
});

module.exports = mongoose.model('User', UserSchema);