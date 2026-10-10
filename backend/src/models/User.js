const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, trim: true, unique: true, sparse: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['admin', 'candidate'], default: 'candidate' },
    phone: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    headline: { type: String, trim: true, default: '' },
    experienceYears: { type: Number, min: 0, default: 0 },
    currentCompany: { type: String, trim: true, default: '' },
    education: { type: String, trim: true, default: '' },
    skills: [{ type: String, trim: true }],
    about: { type: String, trim: true, default: '' },
    resume: {
      url: { type: String, default: '' },
      originalName: { type: String, default: '' },
      uploadedAt: { type: Date },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
