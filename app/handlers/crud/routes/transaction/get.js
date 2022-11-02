import { Repository } from "@/common/repository";

export class GetTransaction {
  static main = async (req, res, next) => {
    try {
      const params = { ...req.params, ...(req.query || {}) };

      let response = await Repository.getTransaction({ params });
      if (!response) {
        return res.status(404).json({ response: null });
      }

      return res.status(200).json({ response });
    } catch (error) {
      return res.status(500).json({ response: null, errors: [error.message] });
    }
  };
}

export default GetTransaction;
