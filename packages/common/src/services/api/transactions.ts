import { getFirestore, runTransaction } from "firebase/firestore";

import { calcLocationStat, calcUserStat } from "../statistic";
import { OperationDoc } from "./operations";
import { apiRefs } from "./refs";

const db = getFirestore();

export const removeOperationTransaction = async (operationId: string) => {
  try {
    await runTransaction(db, async (transaction) => {
      const operationRef = apiRefs.operation(operationId);
      const operationDoc = await transaction.get(operationRef);

      if (!operationDoc.exists()) {
        throw "Document does not exist!";
      }

      const operation = operationDoc.data();
      const { userId, locationId } = operation;
      const userRef = apiRefs.user(userId);
      const locationRef = apiRefs.location(locationId);
      const [userDoc, locationDoc] = await Promise.all([
        transaction.get(userRef),
        transaction.get(locationRef),
      ]);

      if (!userDoc.exists() || !locationDoc.exists()) {
        throw "Document does not exist!";
      }

      const prevUserStatistic = userDoc.data().statistic || {};
      const userStat = calcUserStat(prevUserStatistic, "-", operation);

      const location = locationDoc.data();
      const newLocationStat = calcLocationStat(location, "-", operation);

      transaction.delete(apiRefs.operation(operationId));
      transaction.update(userRef, { statistic: userStat });
      transaction.update(locationRef, { statistic: newLocationStat });
    });
    console.log("Transaction successfully committed!");
  } catch (e) {
    console.log("Transaction failed: ", e);
  }
};

export const editOperationTransaction = async (operationId: string, newOperation: OperationDoc) => {
  try {
    await runTransaction(db, async (transaction) => {
      const operationRef = apiRefs.operation(operationId);
      const prevOperationDoc = await transaction.get(operationRef);

      if (!prevOperationDoc.exists()) {
        throw "Document does not exist!";
      }

      const prevOperation = prevOperationDoc.data();
      const { userId, locationId } = prevOperation;

      const userRef = apiRefs.user(userId);

      const prevLocationRef = apiRefs.location(locationId);
      const [userDoc, prevLocationDoc] = await Promise.all([
        transaction.get(userRef),
        transaction.get(prevLocationRef),
      ]);

      const isLocationChange = newOperation.locationId !== locationId;
      const newLocationRef = apiRefs.location(newOperation.locationId);
      const newLocationDoc = isLocationChange ? await transaction.get(newLocationRef) : null;

      if (!userDoc.exists() || !prevLocationDoc.exists()) {
        throw "Document does not exist!";
      }

      const prevUserStat = userDoc.data().statistic || {};

      // отнимаем старую статистику и добавляем новую
      const prevUserStatWithout = calcUserStat(prevUserStat, "-", prevOperation);
      const userStat = calcUserStat(prevUserStatWithout, "+", newOperation);

      const prevLocationStat = prevLocationDoc.data().statistic;

      if (isLocationChange) {
        const newLocationStat = newLocationDoc?.data()?.statistic;
        const prevLocStatWithoutOp = calcLocationStat(prevLocationStat, "-", prevOperation);
        const newLocationStatWithOp = calcLocationStat(newLocationStat, "+", newOperation);
        transaction.update(prevLocationRef, { statistic: prevLocStatWithoutOp });
        transaction.update(newLocationRef, { statistic: newLocationStatWithOp });
      } else {
        const prevLocStatWithoutOp = calcLocationStat(prevLocationStat, "-", prevOperation);
        const newLocationStat = calcLocationStat(prevLocStatWithoutOp, "+", newOperation);
        transaction.update(prevLocationRef, { statistic: newLocationStat });
      }

      transaction.update(operationRef, newOperation);
      transaction.update(userRef, { statistic: userStat });
    });
    console.log("Transaction successfully committed!");
  } catch (e) {
    console.log("Transaction failed: ", e);
  }
};
