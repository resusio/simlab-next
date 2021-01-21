import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useSwr from 'swr';

import _ from 'underscore';

import { fetcherWithToken, getAccessToken } from './';
import type { ApiHookResult } from './';

import { ReportListType, ReportListValidate } from '../../models/reportList.model';

export type ReportListApiHook = ApiHookResult & { reportList: ReportListType | null };
type ReportListApiHookState = ReportListApiHook & { accessToken: string | null };
export type ReportListApiHookResult = ReportListApiHook & { mutateCache: () => void };

const useReportList = () => {
  const auth0 = useAuth0();

  const [state, setState] = useState<ReportListApiHookState>({
    error: false,
    loading: true,
    reportList: null,
    accessToken: null,
  });

  const { data, error, mutate } = useSwr(
    state.accessToken ? [`/api/listUserReports`, state.accessToken] : null,
    fetcherWithToken,
    { shouldRetryOnError: false }
  );

  const mutateCache = () => {
    mutate();
  };

  // Effect to respond to a change in user and generate an access token for the user.
  useEffect(() => {
    if (auth0.user) {
      (async () => {
        const accessToken = await getAccessToken('list:report', auth0);

        setState((state) => ({ ...state, accessToken })); // Save the access token into the state
      })();
    }
  }, [auth0.user]);

  // Effect to respond to changes in api result from useSwr and update state of hook
  useEffect(() => {
    setState((state) => ({
      ...state,
      loading: Boolean(!data && !error),
      error: error?.toString() ?? false,
      reportList: ReportListValidate(data) ? data : null,
    }));
  }, [error, data]);

  return _.omit({ ...state, mutateCache }, 'accessToken');
};

export default useReportList;
