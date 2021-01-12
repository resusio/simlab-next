import type { NextApiRequest, NextApiResponse } from 'next';

import SavedReportDocumentModel, {
  SavedReportDocumentType,
} from '../../../database/savedReport.mongoose';
import { SavedReportType } from '../../../models/savedReport.model';

import { dbConnect } from '../../../database';
import { ReportListType } from '../../../models/reportList.model';
import mongoose from 'mongoose';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    // Fetch and validate provided report to save
    if (req?.query?.reportId && typeof req.query.reportId === 'string') {
      const reportId = req.query.reportId;

      await dbConnect();

      // Validate the objectId
      if (!mongoose.isValidObjectId(reportId))
        return res.status(404).json({ status: 404, message: 'Not Found' });

      const dbResult = await SavedReportDocumentModel.findById(reportId).exec();

      if (!dbResult || (dbResult as SavedReportDocumentType).validateSync())
        return res.status(404).json({ status: 404, message: 'Not Found' });

      const formattedResult: SavedReportType = (dbResult as SavedReportDocumentType).toObject({
        minimize: false,
        flattenMaps: true,
      });

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
