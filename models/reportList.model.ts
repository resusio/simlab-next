import { PatientInfoType, ajvPatientInfoTypeSchema } from './savedReport.model';
import Ajv, { JSONSchemaType } from 'ajv';

interface ReportListItem {
  id: string;
  userId: string;
  reportName: string;
  tags: string[];
  authorName: string;
  isPublic: boolean;
  patient: PatientInfoType;
  diseaseIds: string[];
}

export type ReportListType = ReportListItem[];

export const ajvReportListItemSchema: JSONSchemaType<ReportListItem> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    userId: { type: 'string' },
    reportName: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
    authorName: { type: 'string' },
    isPublic: { type: 'boolean' },
    patient: ajvPatientInfoTypeSchema,
    diseaseIds: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'id',
    'userId',
    'reportName',
    'tags',
    'authorName',
    'isPublic',
    'patient',
    'diseaseIds',
  ],
};

export const ajvReportListSchema: JSONSchemaType<ReportListType> = {
  type: 'array',
  items: ajvReportListItemSchema,
};

export const ReportListValidate = new Ajv({ code: { es5: true } }).compile(ajvReportListSchema);
