import mongoose, { Schema, Document } from 'mongoose';

import { FeedbackMessageType } from '../../../models/feedbackMessage.model';

export type FeedbackMessageDocumentType = FeedbackMessageType & Document;

const FeedbackMessageSchema: Schema = new Schema(
  {
    userId: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default (mongoose.connection.models
  .Feedback as mongoose.Model<FeedbackMessageDocumentType>) ??
  mongoose.model<FeedbackMessageDocumentType>('Feedback', FeedbackMessageSchema);
