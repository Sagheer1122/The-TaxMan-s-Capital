import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address'
      ],
      index: true
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      index: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Never return password in queries by default
    },
    phone: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'mentor', 'employer', 'moderator', 'admin', 'team_head'],
        message: '{VALUE} is not a supported role'
      },
      default: 'student',
      index: true
    },
    education: {
      type: String,
      default: 'Chartered Accountancy'
    },
    qualification: {
      type: String,
      enum: ['PRC', 'CAF', 'CFAP', 'MSA', 'ACCA', 'Qualified'],
      default: 'CAF'
    },
    level: {
      type: String,
      default: 'CAF'
    },
    institute: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: 'Lahore'
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    interests: {
      type: [String],
      default: []
    },
    experience: {
      type: String,
      default: 'Entry Level / Trainee'
    },
    papersCleared: {
      type: Number,
      default: 0
    },
    cvUrl: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verificationToken: String,
    isEmailVerified: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-save hook: Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance Method: Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance Method: Generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      name: this.name,
      username: this.username
    },
    process.env.JWT_SECRET || 'super_secret_production_jwt_taxman_capital_2026_key_secure',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

export const User = mongoose.model('User', userSchema);
