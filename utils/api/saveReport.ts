import axios from 'axios';

import type { Auth0ContextInterface } from '@auth0/auth0-react';

import { getAccessToken } from './index';

import { SavedReportType } from '../../models/savedReport.model';

export const saveNewReport = async (
  newReport: Omit<SavedReportType, '_id'>,
  auth0: Auth0ContextInterface
) => {
  const accessToken = await getAccessToken('save:report', auth0);

  if (accessToken) {
    const response = await axios.post('/api/saveReport', newReport, {
      timeout: 4000,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (typeof response.data === 'string') return response.data;
  }
  return false;
};

export const saveUpdateReport = async (
  reportId: string,
  updatedReport: Omit<SavedReportType, '_id'>,
  auth0: Auth0ContextInterface
) => {
  const accessToken = await getAccessToken('save:report', auth0);

  if (accessToken) {
    const response = await axios.post(`/api/saveReport/${reportId}`, updatedReport, {
      timeout: 4000,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (typeof response.data === 'string') return response.data;
  }
  return false;
};
