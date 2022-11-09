export class Utils {
  static getStatementProcessed = ({ statement }) => {
    return {
      id: statement.sk.replace("Statement#", ""),
      name: statement.name,
      type: statement.type,
    };
  };

  static getStatementsProcessed = ({ statements }) => {
    let list = [];
    statements.forEach((statement) => {
      let item = {
        id: statement.sk.replace("Statement#", ""),
        name: statement.name,
        type: statement.type,
      };
      list.push(item);
    });
    return list;
  };

  static getTransactionProcessed = ({ transaction, statements }) => {
    let statement = statements.find(
      (x) => x.sk === `Statement#${transaction.statement}`
    );
    return {
      id: transaction.sk.replace("Transaction#", ""),
      statement: statement.name,
      type: statement.type,
      value: transaction.value,
      datetime: transaction.datetime,
    };
  };

  static getTransactionsProcessed = ({ transactions, statements }) => {
    let list = [];
    transactions
      .sort((a, b) => a.timestamp - b.timestamp)
      .forEach((transaction) => {
        let statement = statements.find(
          (x) => x.sk === `Statement#${transaction.statement}`
        );
        let item = {
          id: transaction.sk.replace("Transaction#", ""),
          statement: statement.name,
          type: statement.type,
          value: transaction.value,
          datetime: transaction.datetime,
        };
        list.push(item);
      });
    return list;
  };
}

export default Utils;
