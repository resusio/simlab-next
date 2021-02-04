import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

import SavedReportDocumentModel from '../database/savedReport.mongoose';
import { dbConnect } from '../database';

import withUser, { RequestWithUser } from '../middleware/withUser';

const SaveReportHandler: NextApiHandler = async (
  req: NextApiRequest & RequestWithUser,
  res: NextApiResponse
) => {
  if (!req.userId) return res.status(401).json({ status: 401, message: 'Not Authorized' });

  // Fetch and validate provided report to save
  if (req.body && typeof req.body === 'object') {
    const reportToSave = new SavedReportDocumentModel(req.body);
    const validationError = reportToSave.validateSync();

    if (validationError)
      return res.status(400).json({ status: 400, message: validationError.message }); // Error in body json provided.

    // Ensure that the userId submitting request is the same as listed in the save object
    reportToSave.userId = req.userId;

    await dbConnect();

    const result = await reportToSave.save();

    return res.status(200).json(result?._id);
  }

  return res.status(400).json({
    status: 400,
    message: 'No report object provided in request body',
  });
};

export default withUser(SaveReportHandler, 'save:report');
