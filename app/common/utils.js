export class Utils {
  static getTransactionsProcessed = ({ transactions, statements }) => {
    let list = [];
    transactions.Items.sort((a, b) => a.timestamp - b.timestamp).forEach(
      (transaction) => {
        let statement = statements.Items.find((x) => x.sk === transaction.sk);
        let item = {
          id: transaction.pk.replace("Transaction#", ""),
          name: statement.name,
          type: statement.type,
          value: transaction.value,
          datetime: transaction.datetime,
        };
        list.push(item);
      }
    );
    return list;
  };
}

export default Utils;
