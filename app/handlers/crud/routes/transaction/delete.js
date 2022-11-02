import { Repository } from "@/common/repository";

export class DeleteTransaction {
  static main = async (req, res, next) => {
    try {
      const params = { ...req.params, ...(req.query || {}) };

      let response = await Repository.getTransaction({ params });
      if (response.Count == 0) {
        return res.status(404).json({ response: null });
      }

      let item = response.Items[0];
      await Repository.deleteTransaction({ pk: item.pk, sk: item.sk });

      return res.status(204).json({});
    } catch (error) {
      return res.status(500).json({ errors: [error.message] });
    }
  };
}

export default DeleteTransaction;
