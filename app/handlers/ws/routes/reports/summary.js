import { Repository } from "@/common/repository";
import Utils from "@/common/utils";

export class Summary {
  static main = async (req, res, next) => {
    try {
      const params = { ...req.params, ...(req.query || {}) };
      let transactions = [];
      if (params.lazy == "1") {
        transactions = await Repository.getTransactionsLazyByReference({
          params,
        });
      } else {
        transactions = await Repository.getTransactionsByReference({
          params,
        });
      }

      let statements = await Repository.getStatements();

      let response = Utils.getTransactionsSummary({
        transactions,
        statements,
      });

      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ response: null, errors: [error.message] });
    }
  };
}

export default Summary;
