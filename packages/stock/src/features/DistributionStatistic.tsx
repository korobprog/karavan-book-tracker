import React from "react";
import { TotalStatistic } from "common/src/components/TotalStatistic";

type Props = {};

export const DistributionStatistic = (props: Props) => {
  const data = [
    { title: "MB", value: 12 },
    { title: "B", value: 108 },
    { title: "M", value: 11 },
    { title: "S", value: 15 },
    { title: "Очки", value: 800 },
  ];

  return <TotalStatistic data={data} />;
};
