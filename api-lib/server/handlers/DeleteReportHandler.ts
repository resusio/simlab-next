import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose';

import SavedReportDocumentModel, {
  SavedReportDocumentType,
} from '../database/savedReport.mongoose';
import { SavedReportType } from '../../../models/savedReport.model';
import { dbConnect } from '../database';

import withUser, { RequestWithUser } from '../middleware/withUser';
import _ from 'underscore';

const DeleteReportHandler: NextApiHandler = async (
  req: NextApiRequest & RequestWithUser,
  res: NextApiResponse
) => {
  if (!req.userId) return res.status(401).json({ status: 401, message: 'Not Authorized' });

  if (req.query.reportId) {
    const reportId = req.query.reportId;

    await dbConnect();

    // Validate the objectId
    if (!mongoose.isValidObjectId(reportId))
      return res.status(404).json({ status: 404, message: 'Not Found' });

    const dbResult = await SavedReportDocumentModel.findById(reportId).exec();

    if (!dbResult || (dbResult as SavedReportDocumentType).validateSync())
      return res.status(404).json({ status: 404, message: 'Not Found' });

    if ((dbResult as SavedReportDocumentType).userId === req.userId) {
      // Own report, allowed to delete
      const deleteResult = await SavedReportDocumentModel.findByIdAndDelete(reportId);

      if (deleteResult) return res.status(204).end();
      else return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
  }

  return res.status(400).json({
    status: 400,
    message: 'Missing report Id',
  });
};

export default withUser(DeleteReportHandler, 'save:report');
