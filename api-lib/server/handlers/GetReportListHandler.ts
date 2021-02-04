import type { NextApiRequest, NextApiResponse } from 'next';

import SavedReportDocumentModel, {
  SavedReportDocumentType,
} from '../database/savedReport.mongoose';
import { dbConnect } from '../database';
import { ReportListType } from '../../../models/reportList.model';

import withUser, { RequestWithUser } from '../middleware/withUser';

const ListUserReports = async (req: NextApiRequest & RequestWithUser, res: NextApiResponse) => {
  // Fetch and validate provided report to save
  if (req.userId) {
    const userId = req.userId;

    await dbConnect();

    const dbResult = await SavedReportDocumentModel.find({ userId })
      .sort({ updated_at: -1 })
      .exec();

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

  return res.status(401).json({
    status: 401,
    message: 'Not Authorized',
  });
};

export default withUser(ListUserReports, 'list:report');
