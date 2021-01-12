import type { NextApiRequest, NextApiResponse } from 'next';

import SavedReportDocumentModel, {
  SavedReportDocumentType,
} from '../../../database/savedReport.mongoose';
import { dbConnect } from '../../../database';
import { ReportListType } from '../../../models/reportList.model';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    // Fetch and validate provided report to save
    if (req?.query?.userId && typeof req.query.userId === 'string') {
      const userId = req.query.userId;

      console.log(`userId: ${userId}, mongourl: ${process.env.MONGODB_URL}`);

      await dbConnect();

      const dbResult = await SavedReportDocumentModel.find({ userId }).exec();

      // Remove any documents that do not meet validation requirements.
      const filteredResults = (dbResult as SavedReportDocumentType[]).filter(
        (resultItem) => !resultItem.validateSync()
      );

      const formattedResult: ReportListType = filteredResults.map((savedReport) => ({
        id: savedReport.id,
        userId: savedReport.userId,
        reportName: savedReport.reportName,
        authorName: savedReport.authorName,
        tags: savedReport.tags,
        isPublic: savedReport.isPublic,
        patient: savedReport.patient,
        diseaseIds: savedReport.diseaseIds,
      }));

      return res.status(200).json(formattedResult);
    }
  } else {
    return res.status(400).json({
      status: 400,
      message: 'No report object provided in request body',
    });
  }

  // Any methods other than POST
  return res.status(404).json({
    status: 404,
    message: 'Not Found',
  });
};
