import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose';

import SavedReportDocumentModel, {
  SavedReportDocumentType,
} from '../database/savedReport.mongoose';
import { SavedReportType } from '../../../models/savedReport.model';
import { dbConnect } from '../database';

import withUser, { RequestWithUser } from '../middleware/withUser';
import _ from 'underscore';

const UpdateReportHandler: NextApiHandler = async (
  req: NextApiRequest & RequestWithUser,
  res: NextApiResponse
) => {
  if (!req.userId) return res.status(401).json({ status: 401, message: 'Not Authorized' });

  if (req.query.reportId) {
    // Ensure reportId is provided
    const reportId = req.query.reportId;

    // Fetch and validate provided report to save
    if (req.body && typeof req.body === 'object') {
      const reportToSave = new SavedReportDocumentModel(req.body);
      const validationError = reportToSave.validateSync();

      if (validationError)
        return res.status(400).json({ status: 400, message: validationError.message }); // Error in body json provided.

      // Ensure that the userId submitting request is the same as listed in the save object
      let updateReportData = { ...req.body }; // clone to update
      updateReportData.userId = req.userId;

      await dbConnect();

      // First fetch the report with the stated reportId
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

      // Ensure that the userId of the report store in the database is the same as the userId making
      // the overwrite/save/update request currently.
      if (formattedResult.userId === req.userId) {
        // Allow save
        const result = await SavedReportDocumentModel.findByIdAndUpdate(
          reportId,
          updateReportData,
          { overwrite: true, new: true }
        );
        if (result) return res.status(200).json(result?._id);
        else return res.status(500).json({ status: 500, message: 'Unknown error' });
      } else return res.status(401).json({ status: 401, message: 'Not Authorized' });
    }
  }

  return res.status(400).json({
    status: 400,
    message: 'Missing report Id.',
  });
};

export default withUser(UpdateReportHandler, 'save:report');
