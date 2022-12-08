import Bundle from "@/handlers/load-data/support/bundle";

export async function main(event, context) {
  try {
    const bundle = new Bundle(event, context);

    await bundle.checkAndResetDatabase();
    await bundle.createStatements();
    await bundle.createTransactions();

    return "Load data completed!";
  } catch (error) {
    return error;
  }
}
