import type { NextApiRequest, NextApiResponse } from 'next';

import SavedReportDocumentModel from '../../database/savedReport.mongoose';
import { dbConnect } from '../../database';

//TODO: Persist db connections: https://developer.mongodb.com/how-to/nextjs-with-mongodb OR https://vercel.com/guides/deploying-a-mongodb-powered-api-with-node-and-vercel
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    // Fetch and validate provided report to save
    if (req.body && typeof req.body === 'object') {
      const reportToSave = new SavedReportDocumentModel(req.body);
      const validationError = reportToSave.validateSync();

      if (validationError)
        return res.status(400).json({ status: 400, message: validationError.message }); // Error in body json provided.

      await dbConnect();

      const result = await reportToSave.save();

      return res.status(200).json(result?._id);
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
