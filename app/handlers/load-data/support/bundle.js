import { Repository } from "@/common/repository";
import { v4 as uuidv4 } from "uuid";
import momentRandom from "moment-random";

export class Bundle {
  constructor(event, context) {
    this.event = event;
    this.context = context;
    this.batchSize = 100;

    this.income_statements = ["Credit Card", "Pix", "Invoice", "Cash"];
    this.cost_statements = [
      "Payroll",
      "Energy",
      "Water",
      "Tax",
      "Transport",
      "Food",
      "Reform",
      "Gifts",
    ];
  }

  createStatements = async () => {
    for (let i = 0; i < this.income_statements.length; i++) {
      let content = {
        id: i + 1,
        name: this.income_statements[i],
        type: "INCOME",
      };
      await Repository.createStatement({ content });
    }
    console.log(`${this.income_statements.length} income statements created`);

    for (let i = 0; i < this.cost_statements.length; i++) {
      let content = {
        id: i + this.income_statements.length + 1,
        name: this.cost_statements[i],
        type: "COST",
      };
      await Repository.createStatement({ content });
    }
    console.log(`${this.cost_statements.length} cost statements created`);
  };

  createTransactions = async () => {
    let total = 0;
    while (this.context.getRemainingTimeInMillis() > 30000) {
      let promises = [];
      for (let i = 0; i < this.batchSize; i++) {
        promises.push(await this.generateIncomeTransactions());
        promises.push(await this.generateCostTransactions());
      }

      await Promise.all(promises);
      total += this.batchSize * 2;
      console.log(`Total transactions created (${total})`);
    }
  };

  generateIncomeTransactions = async () => {
    let content = {
      id: uuidv4(),
      statement: Math.floor(Math.random() * this.cost_statements.length) + 1,
      value: parseFloat((Math.random() * 5000).toFixed(2)),
      datetime: momentRandom(Date.now(), new Date("01/01/2020")),
    };
    await Repository.createTransaction({ content });
  };

  generateCostTransactions = async () => {
    let content = {
      id: uuidv4(),
      statement:
        Math.floor(Math.random() * this.cost_statements.length) +
        this.income_statements.length +
        1,
      value: parseFloat((Math.random() * 3000).toFixed(2)),
      datetime: momentRandom(Date.now(), new Date("01/01/2020")),
    };
    await Repository.createTransaction({ content });
  };
}

export default Bundle;
