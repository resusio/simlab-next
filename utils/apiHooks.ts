import useSwr from 'swr';
import axios from 'axios';

import { SavedReportType, SavedReportValidate } from '../models/savedReport.model';
import { ReportListValidate } from '../models/reportList.model';

const fetcher = (url: string) => axios.get(url, { timeout: 4000 }).then((res) => res.data);

export const useSavedReport = (reportId: string | null) => {
  const { data, error } = useSwr(reportId ? `/api/getReport/${reportId}` : null, fetcher);

  // Validate here and return typed object
  if (SavedReportValidate(data)) {
    return {
      loadedReport: data,
      isLoading: !error && !data,
      isError: error ? true : false,
    };
  } else {
    return { loadedReport: null, isLoading: false, isError: true };
  }
};

export const useReportList = (userId: string | undefined) => {
  const { data, error } = useSwr(userId ? `/api/listUserReports/${userId}` : null, fetcher);

  // Validate and return a typed object
  if (ReportListValidate(data)) {
    return {
      reportList: data,
      isLoading: !error && !data,
      isError: error ? true : false,
    };
  } else {
    return {
      reportList: null,
      isLoading: !error && !data,
      isError: true,
    };
  }
};

export const saveNewReport = async (newReport: Omit<SavedReportType, '_id'>) => {
  const response = await axios.post('/api/saveReport', newReport);

  if (typeof response.data === 'string') return response.data;
  else return false;
};
