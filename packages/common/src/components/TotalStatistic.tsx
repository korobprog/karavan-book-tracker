import React from "react";
import { Row, Statistic as AntdStatistic } from "antd";

type TotalStaticticData = {
  title: string;
  value: number;
}[];

type Props = {
  data: TotalStaticticData;
};

export const TotalStatistic = (props: Props) => {
  const { data } = props;

  return (
    <Row justify="space-between" style={{ padding: 14 }}>
      {data.map(({ title, value }) => (
        <AntdStatistic key={title} title={title} value={value} groupSeparator="" />
      ))}
    </Row>
  );
};
