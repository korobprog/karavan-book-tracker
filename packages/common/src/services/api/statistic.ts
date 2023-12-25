import moment from "moment";

export type UserStatisticType = {
  count: number;
  points: number;
};

export const defaultYearUserStatistic: UserStatisticType = {
  count: 0,
  points: 0,
};

export type BaseStatisticItem = {
  MB: number; // Mahabig
  B: number; // Big
  M: number; // Medium
  S: number; // Small
  SB: number; // SB set
  CC: number; // CC set
  O: number; // Other
};

export const defaultBaseStatistic: BaseStatisticItem = {
  MB: 0,
  B: 0,
  M: 0,
  S: 0,
  SB: 0,
  CC: 0,
  O: 0,
};

// export type BaseStatisticItem1 = {
//   points: number;
//   count: number; // Общее количество
//   otherCount: number; // Из них количество без баллов
// };

export type BaseStatisticWithOnlineItem = BaseStatisticItem & {
  online: Partial<BaseStatisticItem>;
};

/*
  Объект с ключами {
    "2023" - за год
    "2023-01" - январь 2023
    "2023-Q1" - первый квартал 2023
  }
*/
export type BaseStatistic = Record<string, Partial<BaseStatisticItem>>;
export type BaseStatisticWithOnline = Record<string, BaseStatisticWithOnlineItem>;

export enum StatisticDateKeys {
  year = "year",
  month = "month",
  quarter = "quarter",
}

export const getStatisticDateKeys = (date: moment.MomentInput = moment()) => {
  const momentDate = moment(date);
  return {
    [StatisticDateKeys.year]: momentDate.format("YYYY"),
    [StatisticDateKeys.month]: momentDate.format("YYYY-MM"),
    [StatisticDateKeys.quarter]: momentDate.format("YYYY-[Q]Q"),
  };
};

export const typePointsMap = {
  MB: 2,
  B: 1,
  M: 0.5,
  S: 0.25,
  SB: 104,
  CC: 36,
  O: 0,
};

export const calcStaticticPointsSum = (baseStatisticItem?: Partial<BaseStatisticItem>) => {
  const points = baseStatisticItem
    ? Object.entries(baseStatisticItem).reduce((acc, [key, count]) => {
        return acc + typePointsMap[key as keyof BaseStatisticItem] * count;
      }, 0)
    : 0;

  return points;
};
