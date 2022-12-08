import AWS from "aws-sdk";
import moment from "moment";
import md5 from "crypto-js/md5";

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

    let response = await docClient.query(props).promise();
    return response.Items;
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
    const hashDigest = md5(content.name + content.type);
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      Item: {
        pk: "Statement",
        sk: `Statement#${hashDigest}`,
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
      KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
      ExpressionAttributeValues: {
        ":pk": "Transaction",
        ":sk": "Transaction#",
      },
    };

    let response = await docClient.query(props).promise();
    return response.Items;
  };

  static getTransaction = async ({ params }) => {
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      Key: { pk: "Transaction", sk: `Transaction#${params.id}` },
    };

    let response = await docClient.get(props).promise();
    return response.Item;
  };

  static createTransaction = async ({ content }) => {
    const date = moment(content.datetime);
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      Item: {
        pk: "Transaction",
        sk: `Transaction#${content.id}`,
        statement: content.statement,
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

    let response = await docClient.query(props).promise();
    return response.Items;
  };

  static getTransactionsBetweenTimestamp = async ({ params }) => {
    const start = moment(params.start, "DD-MM-YYYY");
    const end = moment(params.end, "DD-MM-YYYY")
      .add(1, "days")
      .add(-1, "seconds");
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
      IndexName: "timestamp-gsi",
      KeyConditionExpression: "pk = :pk and #timestamp between :start and :end",
      ExpressionAttributeValues: {
        ":pk": "Transaction",
        ":start": moment(start).valueOf(),
        ":end": moment(end).valueOf(),
      },
      ExpressionAttributeNames: { "#timestamp": "timestamp" },
    };

    let response = await docClient.query(props).promise();
    return response.Items;
  };

  static deleteAll = async () => {
    const props = {
      TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
    };
    let items = [];
    let data = await docClient.scan(props).promise();
    items = [...items, ...data.Items];
    while (typeof data.LastEvaluatedKey != "undefined") {
      props.ExclusiveStartKey = data.LastEvaluatedKey;
      data = await docClient.scan(props).promise();
      items = [...items, ...data.Items];
    }
    for (let item of items) {
      await docClient
        .delete({
          TableName: process.env.FINANCIAL_TRANSACTIONS_TABLE_NAME,
          Key: {
            pk: item.pk,
            sk: item.sk,
          },
        })
        .promise();
    }
  };
}

export default Repository;
