import moment from "moment";

const startYear = 2022;
export const nowYear = moment().year();

const getAvailableYears = () => {
  const years = [] as number[];
  for (let year = startYear; year >= nowYear; year++) {
    years.push(year);
  }
};

export const availableYears = getAvailableYears();

export const getIsNowYear = (year: number) => year === nowYear;
export const getIsStartYear = (year: number) => year === startYear;
