import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

import SavedReportDocumentModel, {
  SavedReportDocumentType,
} from '../database/savedReport.mongoose';
import { SavedReportType } from '../../../models/savedReport.model';
import { dbConnect } from '../database';

import withUser, { RequestWithUser } from '../middleware/withUser';

const GetReport = async (req: NextApiRequest & RequestWithUser, res: NextApiResponse) => {
  // Fetch and validate provided report to save
  if (req.query.reportId) {
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

    // Check result: if not isPublic, and userid incorrect or not provided, fail 403
    if (!formattedResult.isPublic && formattedResult.userId !== req.userId)
      return res.status(403).json({ status: 403, message: 'Forbidden' });

    return res.status(200).json(formattedResult);
  }

  return res.status(400).json({
    status: 400,
    message: 'Missing report Id',
  });
};

export default withUser(GetReport, 'read:report', false);
