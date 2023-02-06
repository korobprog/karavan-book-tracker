import { addDoc, deleteDoc, getDocFromCache, updateDoc } from "firebase/firestore";

import { calcLocationStat, calcUserStat } from "../statistic";
import { OperationDoc } from "./operations";
import { apiRefs } from "./refs";

export const addOperationMultiAction = async (newOperation: OperationDoc) => {
  try {
    const userRef = apiRefs.user(newOperation.userId);
    const locationRef = apiRefs.location(newOperation.locationId);

    const [userDoc, locationDoc] = await Promise.all([
      getDocFromCache(userRef),
      getDocFromCache(locationRef),
    ]);

    if (!userDoc.exists() || !locationDoc.exists()) {
      throw "Document does not exist!";
    }

    const prevUserStat = userDoc.data().statistic || {};
    const newUserStat = calcUserStat(prevUserStat, "+", newOperation);

    updateDoc(userRef, { statistic: newUserStat });
    addDoc(apiRefs.operations, newOperation);

    // TODO: add isAuthorized to other multiActions
    // ! TODO: if user have long offline it mays overwrite latest statistic
    if (newOperation.isAuthorized) {
      const prevLocationStat = locationDoc.data().statistic;
      const newLocationStat = calcLocationStat(prevLocationStat, "+", newOperation);
      updateDoc(locationRef, { statistic: newLocationStat });
    }

    console.log("MultiAction successfully committed!");
  } catch (e) {
    console.log("MultiAction failed: ", e);
  }
};

export const removeOperationMultiAction = async (operationId: string) => {
  try {
    const operationRef = apiRefs.operation(operationId);
    const operationDoc = await getDocFromCache(operationRef);

    if (!operationDoc.exists()) {
      throw "Document does not exist!";
    }

    const operation = operationDoc.data();
    const userRef = apiRefs.user(operation.userId);
    const locationRef = apiRefs.location(operation.locationId);
    const [userDoc, locationDoc] = await Promise.all([
      getDocFromCache(userRef),
      getDocFromCache(locationRef),
    ]);

    if (!userDoc.exists() || !locationDoc.exists()) {
      throw "Document does not exist!";
    }

    const prevUserStatistic = userDoc.data().statistic || {};
    const userStat = calcUserStat(prevUserStatistic, "-", operation);

    const location = locationDoc.data();
    const newLocationStat = calcLocationStat(location, "-", operation);

    deleteDoc(apiRefs.operation(operationId));
    updateDoc(userRef, { statistic: userStat });
    updateDoc(locationRef, { statistic: newLocationStat });
    console.log("MultiAction successfully committed!");
  } catch (e) {
    console.log("MultiAction failed: ", e);
  }
};

export const editOperationMultiAction = async (operationId: string, newOperation: OperationDoc) => {
  try {
    const operationRef = apiRefs.operation(operationId);
    const prevOperationDoc = await getDocFromCache(operationRef);

    if (!prevOperationDoc.exists()) {
      throw "Document does not exist!";
    }

    const prevOperation = prevOperationDoc.data();

    const userRef = apiRefs.user(prevOperation.userId);

    const prevLocationRef = apiRefs.location(prevOperation.locationId);
    const [userDoc, prevLocationDoc] = await Promise.all([
      getDocFromCache(userRef),
      getDocFromCache(prevLocationRef),
    ]);

    const isLocationChange = newOperation.locationId !== prevOperation.locationId;
    const newLocationRef = apiRefs.location(newOperation.locationId);
    const newLocationDoc = isLocationChange ? await getDocFromCache(newLocationRef) : null;

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
      updateDoc(prevLocationRef, { statistic: prevLocStatWithoutOp });
      updateDoc(newLocationRef, { statistic: newLocationStatWithOp });
    } else {
      const prevLocStatWithoutOp = calcLocationStat(prevLocationStat, "-", prevOperation);
      const newLocationStat = calcLocationStat(prevLocStatWithoutOp, "+", newOperation);
      updateDoc(prevLocationRef, { statistic: newLocationStat });
    }

    updateDoc(operationRef, newOperation);
    updateDoc(userRef, { statistic: userStat });
    console.log("MultiAction successfully committed!");
  } catch (e) {
    console.log("MultiAction failed: ", e);
  }
};
