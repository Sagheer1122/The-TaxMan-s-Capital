import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      index: true
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource'
    }
  },
  {
    timestamps: true
  }
);

bookmarkSchema.index({ user: 1, job: 1 }, { unique: true, sparse: true });

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
