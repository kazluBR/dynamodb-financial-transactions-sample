export class NotFound {
  static async main(req, res, next) {
    res
      .status(404)
      .json({ response: null, errors: ["Ops! Invalid Path or Method"] });
  }
}

export default NotFound;
