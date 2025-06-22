import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Email inválido'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '180d' }, // Opcional: expira usuarios inactivos tras 180 días
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
