import { Repository } from "@/common/repository";
import Utils from "@/common/utils";

export class GetStatement {
  static main = async (req, res, next) => {
    try {
      const params = { ...req.params, ...(req.query || {}) };

      let statement = await Repository.getStatement({ params });
      if (!statement) {
        return res.status(404).json({ response: null });
      }

      let response = Utils.getStatementProcessed({ statement });

      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ response: null, errors: [error.message] });
    }
  };
}

export default GetStatement;
