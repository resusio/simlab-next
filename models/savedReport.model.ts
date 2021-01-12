import { gender, patientInfoType, testResultListType } from '@resusio/simlab';
import Ajv, { JSONSchemaType, Schema } from 'ajv';

export type PatientInfoType = patientInfoType & { name: string; mrn: string };

export interface SavedReportType {
  _id: string;
  userId: string;
  reportName: string;
  tags: string[];
  authorName: string;
  isPublic: boolean;
  patient: PatientInfoType;
  testIds: string[];
  orderSetIds: string[];
  diseaseIds: string[];
  lockedTestIds: string[];
  testResults: testResultListType;
}

export const ajvPatientInfoTypeSchema: JSONSchemaType<PatientInfoType> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    mrn: { type: 'string' },
    age: { type: 'integer' },
    gender: { type: 'string', enum: [gender.Male, gender.Female, gender.Other] },
    height: { type: 'number' },
    weight: { type: 'number' },
  },
  required: ['name', 'mrn', 'age', 'gender', 'height', 'weight'],
};

export const ajvTestResultListTypeSchema: Schema = {
  // FIXME: Hack as AJV does not currently support union types
  type: 'object',
  additionalProperties: {
    anyOf: [{ type: 'string' }, { type: 'number' }],
  },
};

export const ajvSavedReportTypeSchema: JSONSchemaType<SavedReportType> = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    userId: { type: 'string' },
    reportName: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    authorName: { type: 'string' },
    isPublic: { type: 'boolean' },
    patient: ajvPatientInfoTypeSchema,
    testIds: { type: 'array', items: { type: 'string' } },
    orderSetIds: { type: 'array', items: { type: 'string' } },
    diseaseIds: { type: 'array', items: { type: 'string' } },
    lockedTestIds: { type: 'array', items: { type: 'string' } },
    testResults: ajvTestResultListTypeSchema as JSONSchemaType<testResultListType>, // FIXME: Hack as AJV does not currently support union types
  },
  required: [
    '_id',
    'userId',
    'reportName',
    'tags',
    'authorName',
    'isPublic',
    'patient',
    'testIds',
    'orderSetIds',
    'diseaseIds',
    'lockedTestIds',
    'testResults',
  ],
};

export const SavedReportValidate = new Ajv({ code: { es5: true } }).compile(
  ajvSavedReportTypeSchema
);
