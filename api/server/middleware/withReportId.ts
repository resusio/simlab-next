import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

const withReportId = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (Array.isArray(req.query.reportId) && req.query.reportId.length === 1)
      req.query.reportId = req.query.reportId[0];
    else if (req.query.reportId) delete req.query.reportId;

    return handler(req, res);
  };
};

export default withReportId;
