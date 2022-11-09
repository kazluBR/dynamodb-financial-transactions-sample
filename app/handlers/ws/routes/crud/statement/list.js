import { Repository } from "@/common/repository";
import Utils from "@/common/utils";

export class ListStatements {
  static main = async (req, res, next) => {
    try {
      let statements = await Repository.getStatements();

      let response = Utils.getStatementsProcessed({ statements });

      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ response: null, errors: [error.message] });
    }
  };
}

export default ListStatements;
