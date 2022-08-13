import { Tag } from "antd";
import React from "react";
import { LocationDoc } from "../../firebase/useLocations";

type LocationStatisticProps = {
  statistic: LocationDoc["statistic"];
};

export const LocationStatistic: React.FC<LocationStatisticProps> = (props) => {
  const { statistic } = props;

  if (!statistic?.[2022]) {
    return null;
  }

  const {
    totalPrimaryCount,
    totalOtherCount,
    totalOnlineCount,
    totalOnlinePoints,
    totalPoints,
  } = statistic[2022];

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
