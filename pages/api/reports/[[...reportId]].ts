import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

import withReportId from '../../../api-lib/server/middleware/withReportId';

import SaveNewReportHandler from '../../../api-lib/server/handlers/SaveNewReportHandler';
import GetReportListHandler from '../../../api-lib/server/handlers/GetReportListHandler';
import GetReportHandler from '../../../api-lib/server/handlers/GetReportHandler';
import UpdateReportHandler from '../../../api-lib/server/handlers/UpdateReportHandler';
import DeleteReportHandler from '../../../api-lib/server/handlers/DeleteReportHandler';

const ReportsHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return SaveNewReportHandler(req, res);

    case 'GET':
      if (req.query.reportId) return GetReportHandler(req, res);
      else return GetReportListHandler(req, res);

    case 'PUT':
      if (req.query.reportId) return UpdateReportHandler(req, res);

    case 'DELETE':
      if (req.query.reportId) return DeleteReportHandler(req, res);
  }

  // Any invalid methods will return 404
  return res.status(404).json({
    status: 404,
    message: 'Not Found',
  });
};

export default withReportId(ReportsHandler);
