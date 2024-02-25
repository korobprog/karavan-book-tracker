import moment from "moment";

export type UserStatisticType = {
  count: number;
  points: number;
};

export const defaultYearUserStatistic: UserStatisticType = {
  count: 0,
  points: 0,
};

export const bookCountsInSets: Record<string, number> = {
  CC: 9,
  SB: 24,
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

export type StockStatisticItem = {
  MB: number; // Mahabig
  B: number; // Big
  M: number; // Medium
  S: number; // Small
  SB: number; // SB set
  CC: number; // CC set
  totalPoints: number;
  totalCount: number;
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

const generateOptions = (startYear: number): string[] => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const options: string[] = [];
  for (let year = currentYear; year >= startYear; year--) {
    const isCurrentYear = year === currentYear;
    options.push(String(year));
    for (let quarter = isCurrentYear ? Math.ceil(currentMonth / 3) : 4; quarter >= 1; quarter--) {
      const quarterStr = `${year}-Q${quarter}`;
      options.push(quarterStr);
    }
    for (let month = isCurrentYear ? currentMonth : 12; month >= 1; month--) {
      const monthStr = `${year}-${month.toString().padStart(2, "0")}`;
      options.push(monthStr);
    }
  }

  return options;
};

export const getStatisticPeriodOptions = () => {
  const startYear = 2023;
  const options = generateOptions(startYear);
  const periodOptions = options.map((value) => ({ value, label: value }));

  return periodOptions;
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

export const getFullStatistic = (
  period?: string,
  statistic?: BaseStatistic
): StockStatisticItem => {
  const currentStatistic = (period && statistic?.[period]) || {};
  const totalPoints = calcStaticticPointsSum(currentStatistic);
  const { S = 0, M = 0, B = 0, MB = 0, CC = 0, SB = 0 } = currentStatistic;
  const totalCount = S + M + B + MB + CC * bookCountsInSets.CC + SB * bookCountsInSets.SB;

  return {
    S,
    M,
    B,
    MB,
    CC,
    SB,
    totalPoints,
    totalCount,
  };
};

export const mutateFullStatistic = (
  target: StockStatisticItem,
  operator: "+" | "-",
  source: Record<string, any>
) => {
  for (const keyString in target) {
    const key = keyString as keyof StockStatisticItem;
    if (typeof target[key] !== "string" && typeof source[key] !== "string") {
      if (operator === "+") target[key] = (target[key] || 0) + (source[key] || 0);
      if (operator === "-") target[key] = (target[key] || 0) - (source[key] || 0);
    }
  }
};
