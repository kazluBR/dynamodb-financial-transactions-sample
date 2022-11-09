import { Repository } from "@/common/repository";

export class CreateTransaction {
  static main = async (req, res, next) => {
    try {
      let response = await Repository.createTransaction({ content: req.body });

      return res.status(201).json({ response });
    } catch (error) {
      return res.status(500).json({ response: null, errors: [error.message] });
    }
  };
}

export default CreateTransaction;
