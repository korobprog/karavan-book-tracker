import { Tag } from "antd";
import React from "react";
import { LocationDoc } from "common/src/services/api/locations";

type LocationStatisticProps = {
  statistic: LocationDoc["statistic"];
  year: number;
};

export const LocationStatistic: React.FC<LocationStatisticProps> = (props) => {
  const { statistic, year } = props;

  if (!statistic?.[year]) {
    return null;
  }

  const {
    totalPrimaryCount,
    totalOtherCount,
    totalOnlineCount,
    totalOnlinePoints,
    totalPoints,
  } = statistic[year];

  return (
    <>
      {totalPrimaryCount + totalOtherCount > 0 && (
        <Tag color="magenta">
          {"Всего " + (totalPrimaryCount + totalOtherCount) + " шт."}
          {", баллы: " + totalPoints}
        </Tag>
      )}
      {totalPrimaryCount > 0 && (
        <Tag color="gold">{"ШП " + totalPrimaryCount + " шт."}</Tag>
      )}
      {totalOtherCount > 0 && (
        <Tag color="lime">{"Других " + totalOtherCount + " шт."}</Tag>
      )}
      {totalOnlineCount > 0 && (
        <Tag color="geekblue">
          {"Oнлайн " + totalOnlineCount + " шт."}
          {", баллы: " + totalOnlinePoints}
        </Tag>
      )}
    </>
  );
};
