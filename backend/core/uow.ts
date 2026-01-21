import mongoose, { ClientSession } from "mongoose";

type TransactionWork<T> = (session: ClientSession) => Promise<T>;

type UnitOfWork = {
  session: ClientSession;
  withTransaction: <T>(work: TransactionWork<T>) => Promise<T>;
  end: () => Promise<void>;
};

const createUnitOfWork = async (): Promise<UnitOfWork> => {
  const session = await mongoose.startSession();
  const withTransaction = async <T>(work: TransactionWork<T>): Promise<T> => {
    let result: T | undefined;
    await session.withTransaction(async () => {
      result = await work(session);
    });
    if (result === undefined) {
      throw new Error("Transaction did not return a result");
    }
    return result;
  };

  const end = async (): Promise<void> => {
    await session.endSession();
  };

  return { session, withTransaction, end };
};

export { createUnitOfWork };
