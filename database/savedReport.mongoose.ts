import mongoose, { Schema, Document } from 'mongoose';

import { patientInfoType, gender } from '@resusio/simlab';
import { SavedReportType } from '../models/savedReport.model';

export type PatientInfoType = patientInfoType & { name: string; mrn: string };

export type SavedReportDocumentType = SavedReportType & Document;

const PatientSchema: Schema = new Schema({
  name: { type: String, required: true },
  mrn: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: [gender.Male, gender.Female, gender.Other] },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
});

const SavedReportSchema: Schema = new Schema({
  userId: { type: String, required: true },
  reportName: { type: String, required: true },
  tags: { type: [String], required: true },
  authorName: { type: String, required: false, default: 'Anonymous' },
  isPublic: { type: Boolean, required: false, default: true },
  patient: { type: PatientSchema, required: true },
  testIds: { type: [String], required: true },
  orderSetIds: { type: [String], required: true },
  diseaseIds: { type: [String], required: true },
  lockedTestIds: { type: [String], required: true },
  testResults: {
    type: Map,
    of: Schema.Types.Mixed,
    required: true,
    default: undefined,
    validate: {
      validator: (v: any) => {
        if (!(v instanceof Map)) return false; // Must be an array.

        const mapKeys = Array.from(v.keys());
        return mapKeys.reduce(
          (isValid, currKey) =>
            isValid && (typeof v.get(currKey) === 'string' || typeof v.get(currKey) === 'number'),
          true
        );
      },
      message: (props) => `${props.value} is not a valid list of test results`,
    },
  },
});

export default (mongoose.connection.models
  .SavedReport as mongoose.Model<SavedReportDocumentType>) ??
  mongoose.model<SavedReportDocumentType>('SavedReport', SavedReportSchema);
