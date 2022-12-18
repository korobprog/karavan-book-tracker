import { getFirestore, runTransaction } from "firebase/firestore";

import { calcLocationStat, calcUserStat } from "../statistic";
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
      const { userId, locationId, date } = operation;
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
