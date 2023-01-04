import moment from "moment";
import { calcObjectFields } from "../../utils/objects";
import { OperationDoc } from "../api/operations";
import { UserStatisticType } from "../api/statistic";

export const calcUserStat = (
  prevUserStat: Record<number, UserStatisticType>,
  operator: "+" | "-",
  operation: OperationDoc
) => {
  const { date, totalCount: count, totalPoints: points } = operation;
  const operationYear = moment(date).year();
  const userYearStat = prevUserStat[operationYear];
  const operationStat: UserStatisticType = { count, points };
  const newUserStat = { ...prevUserStat };
  newUserStat[operationYear] = calcObjectFields(
    userYearStat,
    operator,
    operationStat
  );

  return newUserStat;
};
