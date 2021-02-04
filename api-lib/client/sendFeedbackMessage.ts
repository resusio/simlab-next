import axios from 'axios';

import type { Auth0ContextInterface } from '@auth0/auth0-react';

import { getAccessToken } from './index';

import { FeedbackMessageType } from '../../models/feedbackMessage.model';

const sendFeedbackMessage = async (
  feedbackMessage: Omit<FeedbackMessageType, '_id'>,
  auth0: Auth0ContextInterface
) => {
  const accessToken = await getAccessToken('send:feedback', auth0);

  const response = await axios.post('/api/feedback', feedbackMessage, {
    timeout: 4000,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (typeof response.data === 'string') return response.data;

  return false;
};

export default sendFeedbackMessage;
