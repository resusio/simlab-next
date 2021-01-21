import axios from 'axios';

import type { Auth0ContextInterface } from '@auth0/auth0-react';

import { getAccessToken } from './index';

import { SavedReportType } from '../../models/savedReport.model';

export const deleteReport = async (deleteReportId: string, auth0: Auth0ContextInterface) => {
  const accessToken = await getAccessToken('delete:report', auth0);

  if (accessToken) {
    const response = await axios.delete(`/api/deleteReport/${deleteReportId}`, {
      timeout: 4000,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 204) return true;
    else return false;
  }
  return false;
};
