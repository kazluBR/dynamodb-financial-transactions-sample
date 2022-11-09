import AWS from "aws-sdk";
import moment from "moment";

const docClient = new AWS.DynamoDB.DocumentClient();

export class Repository {
  static getStatements = async () => {
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
      ExpressionAttributeValues: {
        ":pk": "Statement",
        ":sk": "Statement#",
      },
    };

    return await docClient.query(props).promise();
  };

  static getStatement = async ({ params }) => {
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      Key: { pk: "Statement", sk: `Statement#${params.id}` },
    };

    let response = await docClient.get(props).promise();
    return response.Item;
  };

  static createStatement = async ({ content }) => {
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      Item: {
        pk: "Statement",
        sk: `Statement#${content.id}`,
        name: content.name,
        type: content.type,
      },
    };

    await docClient.put(props).promise();
    return props.Item;
  };

  static getTransactions = async () => {
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      FilterExpression: "begins_with(pk, :pk)",
      ExpressionAttributeValues: {
        ":pk": "Transaction#",
      },
    };

    return await docClient.scan(props).promise();
  };

  static getTransaction = async ({ params }) => {
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      KeyConditionExpression: "pk = :pk AND begins_with ( sk , :sk )",
      ExpressionAttributeValues: {
        ":pk": `Transaction#${params.id}`,
        ":sk": "Statement",
      },
    };

    let response = await docClient.query(props).promise();
    if (response.Count == 0) {
      return null;
    }
    return response.Items[0];
  };

  static createTransaction = async ({ content }) => {
    const date = moment(content.datetime);
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      Item: {
        pk: `Transaction#${content.id}`,
        sk: `Statement#${content.statement}`,
        value: content.value,
        timestamp: moment(date).valueOf(),
        datetime: date.format("DD/MM/YYYY HH:mm:ss"),
        reference: date.format("MM/YYYY"),
      },
    };

    await docClient.put(props).promise();
    return props.Item;
  };

  static deleteTransaction = async ({ pk, sk }) => {
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      Key: {
        pk,
        sk,
      },
    };

    await docClient.delete(props).promise();
  };

  static getTransactionsByReference = async ({ params }) => {
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      IndexName: "reference-gsi",
      KeyConditionExpression: "#reference = :reference",
      ExpressionAttributeValues: {
        ":reference": params.reference,
      },
      ExpressionAttributeNames: { "#reference": "reference" },
    };

    return await docClient.query(props).promise();
  };
}

export default Repository;
