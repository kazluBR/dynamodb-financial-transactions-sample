import { Repository } from "@/common/repository";
import Utils from "@/common/utils";

export class GetTransaction {
  static main = async (req, res, next) => {
    try {
      const params = { ...req.params, ...(req.query || {}) };

      let transaction = await Repository.getTransaction({ params });
      if (!transaction) {
        return res.status(404).json({ response: null });
      }

      let statements = await Repository.getStatements();

      let response = Utils.getTransactionProcessed({ transaction, statements });

      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ response: null, errors: [error.message] });
    }
  };
}

export default GetTransaction;
