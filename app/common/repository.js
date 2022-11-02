import AWS from "aws-sdk";
import moment from "moment";

const docClient = new AWS.DynamoDB.DocumentClient();

export class Repository {
  static getStatement = async ({ params }) => {
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      Key: { pk: "Statement", sk: `Statement#${params.id}` },
    };

    return await docClient.get(props).promise();
  };

  static createStatement = async ({ content }) => {
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      Item: {
        pk: "Statement",
        sk: `Statement#${content.id}`,
        name: content.name,
      },
    };

    await docClient.put(props).promise();
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

    return await docClient.query(props).promise();
  };

  static createTransaction = async ({ content }) => {
    const date = moment.unix(content.datetime);
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      Item: {
        pk: `Transaction#${content.id}`,
        sk: `Statement#${content.statement}`,
        value: content.value,
        datetime: date.format("DD/MM/YYYY HH:mm:ss"),
        reference: date.format("MM/YYYY"),
      },
    };

    await docClient.put(props).promise();
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
}

export default Repository;
