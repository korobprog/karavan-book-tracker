import moment from "moment";
import { OperationDoc } from "../api/operations";
import { UserStatisticType } from "../api/statistic";

export const calcUserStat = (
  prevUserStat: Record<number, UserStatisticType>,
  operator: "+" | "-",
  operation: OperationDoc
) => {
  const { date, totalCount, totalPoints } = operation;
  const operationYear = moment(date).year();
  const userYearStat = prevUserStat[operationYear];

  const newUserStatistic = { ...prevUserStat };
  newUserStatistic[operationYear] = userYearStat
    ? {
        count: userYearStat.count - totalCount,
        points: userYearStat.points - totalPoints,
      }
    : { count: 0, points: 0 };
  return newUserStatistic;
};
