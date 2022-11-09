import { Repository } from "@/common/repository";

export class ListTransactions {
  static main = async (req, res, next) => {
    try {
      let response = await Repository.getTransactions();

      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ response: null, errors: [error.message] });
    }
  };
}

export default ListTransactions;
