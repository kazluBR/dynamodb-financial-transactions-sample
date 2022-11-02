import { Repository } from "@/common/repository";

export class CreateStatement {
  static main = async (req, res, next) => {
    try {
      await Repository.createStatement({ content: req.body });

      return res.status(201).json({ message: "ok" });
    } catch (error) {
      return res.status(500).json({ errors: [error.message] });
    }
  };
}

export default CreateStatement;
