import { Repository } from "@/common/repository";
import Utils from "@/common/utils";

export class CashFlow {
  static main = async (req, res, next) => {
    try {
      const params = { ...req.params, ...(req.query || {}) };
      let transactions = [];
      if (params.lazy == "1") {
        transactions = await Repository.getTransactionsLazyBetweenTimestamp({
          params,
        });
        transactions = transactions.sort((a, b) => a.timestamp - b.timestamp);
      } else {
        transactions = await Repository.getTransactionsBetweenTimestamp({
          params,
        });
      }

      let statements = await Repository.getStatements();

      let response = Utils.getTransactionsProcessed({
        transactions,
        statements,
      });

      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ response: null, errors: [error.message] });
    }
  };
}

export default CashFlow;
