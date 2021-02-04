import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

import FeedbackMessageDocumentModel from '../../../api-lib/server/database/feedbackMessage.mongoose';

import { dbConnect } from '../../../api-lib/server/database';
import withUser, { RequestWithUser } from '../../../api-lib/server/middleware/withUser';

const FeedbackHandler: NextApiHandler = async (
  req: NextApiRequest & RequestWithUser,
  res: NextApiResponse
) => {
  if (req.method !== 'POST')
    res.status(404).json({
      status: 404,
      message: 'Not Found',
    });

  // Fetch and validate provided report to save
  if (req.body && typeof req.body === 'object') {
    const messageToSave = new FeedbackMessageDocumentModel(req.body);

    if (req.userId)
      // Add userId to the message
      messageToSave.userId = req.userId;

    const validationError = messageToSave.validateSync();
    
    if (validationError)
      return res.status(400).json({ status: 400, message: validationError.message }); // Error in body json provided.

    await dbConnect();

    const result = await messageToSave.save();

    return res.status(200).json(result?._id);
  }
};

export default withUser(FeedbackHandler, 'send:feedback', false);
