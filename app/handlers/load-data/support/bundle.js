import { Repository } from "@/common/repository";
import { v4 as uuidv4 } from "uuid";
import momentRandom from "moment-random";
import md5 from "crypto-js/md5";

export class Bundle {
  constructor(event, context) {
    this.context = context;
    if (event.requestContext.http.method != "POST") {
      throw new Error("Method Not Allowed");
    }

    const payload = JSON.parse(event.body);
    this.reset = payload.reset;
    this.statements = payload.statements;
  }

  checkAndResetDatabase = async () => {
    if (this.reset == "1") {
      await Repository.deleteAll();
    }
  };

  createStatements = async () => {
    for (let statement of this.statements) {
      let content = {
        name: statement.name,
        type: statement.type,
      };
      await Repository.createStatement({ content });
    }
  };

  createTransactions = async () => {
    for (let statement of this.statements) {
      let promises = [];
      for (let i = 0; i < statement.count; i++) {
        promises.push(await this.generateTransaction(statement));
      }
      await Promise.all(promises);
    }
  };

  generateTransaction = async (statement) => {
    const hashDigest = md5(statement.name + statement.type);
    let content = {
      id: uuidv4(),
      statement: hashDigest.toString(),
      value: parseFloat(
        (Math.random() * statement.range.to + statement.range.from).toFixed(2)
      ),
      datetime: momentRandom(Date.now(), new Date(process.env.INITIAL_DATE)),
    };
    await Repository.createTransaction({ content });
  };
}

export default Bundle;
