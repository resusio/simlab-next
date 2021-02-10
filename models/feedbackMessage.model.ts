import Ajv, { JSONSchemaType } from 'ajv';

export interface FeedbackMessageType {
  _id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export const ajvFeedbackMessageSchema: JSONSchemaType<FeedbackMessageType> = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    userId: { type: 'string', nullable: true },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string' },
    message: { type: 'string' },
  },
  required: ['_id', 'firstName', 'lastName', 'email', 'message'],
};

export const FeedbackMessageValidate = new Ajv({ code: { es5: true } }).compile(
  ajvFeedbackMessageSchema
);
