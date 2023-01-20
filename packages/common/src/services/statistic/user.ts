import moment from "moment";
import { calcObjectFields } from "../../utils/objects";
import { getOperations, OperationDoc } from "../api/operations";
import { defaultYearUserStatistic, UserStatisticType } from "../api/statistic";
import { updateProfile, UserDoc, UserDocWithId } from "../api/useUser";

export const getUserStat = (operation: OperationDoc): UserStatisticType => {
  const { totalCount = 0, totalPoints = 0 } = operation;

  return { count: totalCount, points: totalPoints };
};

export const calcUserStat = (
  prevUserStat: UserDoc["statistic"],
  operator: "+" | "-",
  operation: OperationDoc
) => {
  const { date, totalCount: count, totalPoints: points } = operation;
  const operationYear = moment(date).year();
  const userYearStat = prevUserStat?.[operationYear] || defaultYearUserStatistic;
  const operationStat: UserStatisticType = { count, points };
  const newUserStat = { ...prevUserStat };
  newUserStat[operationYear] = calcObjectFields(userYearStat, operator, operationStat);

  return newUserStat;
};

export const recalculateStatisticToUsers = async (users: UserDocWithId[]) => {
  try {
    const operationsSnapshot = await getOperations();
    const userIdsWithoutStatsMap = new Set(users.map((user) => user.id));

    const statsByUsers = {} as Record<string, UserDoc["statistic"]>;

    // Из операций формируем map статистики по юзерам
    operationsSnapshot.forEach((doc) => {
      const operation = doc.data();
      const { userId } = operation;
      const operationYear = moment(operation.date).year();

      if (userId) {
        const newOperationStat = getUserStat(operation);

        const prevStat = statsByUsers[userId];
        const newStat = { ...prevStat };
        const prevStatYear = prevStat?.[operationYear] || defaultYearUserStatistic;
        const newStatYear = calcObjectFields(prevStatYear, "+", newOperationStat);

        newStat[operationYear] = newStatYear;
        statsByUsers[userId] = newStat;
      }
    });

    // Переписываем статистику в юзерах, где были операции
    const promises = Object.keys(statsByUsers).map(async (userId) => {
      const newStatistic = statsByUsers[userId];
      userIdsWithoutStatsMap.delete(userId);
      if (newStatistic) {
        return updateProfile(userId, { statistic: newStatistic });
      }
    });

    // Где не было операций - затираем имеющиеся значения
    userIdsWithoutStatsMap.forEach(async (userId) => {
      if (userId) {
        const promise = updateProfile(userId, {
          statistic: {},
        });
        promises.push(promise);
      }
    });

    await Promise.all(promises);
  } catch (e) {
    console.error(e);
  }
};
