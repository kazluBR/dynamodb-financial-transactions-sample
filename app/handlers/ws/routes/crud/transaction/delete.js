import { Repository } from "@/common/repository";

export class DeleteTransaction {
  static main = async (req, res, next) => {
    try {
      const params = { ...req.params, ...(req.query || {}) };

      let response = await Repository.getTransaction({ params });
      if (!response) {
        return res.status(404).json({ response: null });
      }

      await Repository.deleteTransaction({ pk: response.pk, sk: response.sk });

      return res.status(204).json({});
    } catch (error) {
      return res.status(500).json({ response: null, errors: [error.message] });
    }
  };
}

export default DeleteTransaction;
