import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useSwr from 'swr';

import _ from 'underscore';

import { fetcherWithToken, getAccessToken } from '.';
import type { ApiHookResult } from '.';

import { SavedReportType, SavedReportValidate } from '../../models/savedReport.model';
import { serializedReportType } from '@resusio/simlab';

export type SavedReportApiHook = ApiHookResult & { loadedReport: SavedReportType | null };
type SavedReportApiHookState = SavedReportApiHook & { accessToken: string | null };
export type SavedReportApiHookResult = SavedReportApiHook & { mutateCache: () => void, mutateReportLocal: (newReport: serializedReportType) => void };

const useSavedReport = (reportId: string | null): SavedReportApiHookResult => {
  const auth0 = useAuth0();

  const [state, setState] = useState<SavedReportApiHookState>({
    error: false,
    loading: Boolean(reportId),
    loadedReport: null,
    accessToken: null,
  });

  // Flag to indicate if a request should be sent to the api route.
  const shouldSendRequest =
    (((auth0.isLoading || Boolean(auth0.user)) && Boolean(state.accessToken)) || // loading a user or user exists -> accessToken should be present before we send the request.
      (!auth0.isLoading && !Boolean(auth0.user))) && // not loading a user and not already loaded a user -> no accessToken needed
    Boolean(reportId); // Only sent request if reportId is present

  // Send request even if no access token: public reports can still be loaded
  const { data, error, mutate } = useSwr(
    shouldSendRequest ? [`/api/reports/${reportId}`, state.accessToken] : null,
    fetcherWithToken,
    { shouldRetryOnError: false, revalidateOnReconnect: false, revalidateOnFocus: false }
  );

  const mutateCache = () => {
    mutate();
  };

  const mutateReportLocal = (newReport: serializedReportType) => {
    mutate(async (data: SavedReportType) => {
      return { ...data, ...newReport };
    }, false);
  }

  // Effect to respond to a change in user and generate an access token for the user.
  useEffect(() => {
    if (auth0.user) {
      (async () => {
        const accessToken = await getAccessToken('read:report', auth0);

        setState((state) => ({ ...state, accessToken })); // Save the access token into the state
      })();
    }
  }, [auth0.user]);

  // Effect to respond to changes in api result from useSwr and update state of hook
  useEffect(() => {
    setState((state) => ({
      ...state,
      loading: Boolean(!data && !error && reportId),
      error: error?.toString() ?? false,
      loadedReport: SavedReportValidate(data) ? data : null,
    }));
  }, [error, data, reportId]);

  return _.omit({ ...state, mutateCache, mutateReportLocal }, 'accessToken');
};

export default useSavedReport;
