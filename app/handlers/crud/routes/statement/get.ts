import { Repository } from "@/common/repository";

export class GetStatement {
  static main = async (req, res, next) => {
    try {
      const params = { ...req.params, ...(req.query || {}) };

      let response = await Repository.getStatement({ params });
      if (!response) {
        return res.status(404).json({ response: null });
      }

      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ errors: [error.message] });
    }
  };
}

export default GetStatement;
