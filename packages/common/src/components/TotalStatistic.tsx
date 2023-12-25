import React from "react";
import { Row, Statistic as AntdStatistic } from "antd";

type TotalStaticticData = {
  title: string;
  value: number;
}[];

type Props = {
  data: TotalStaticticData;
  style?: React.CSSProperties;
};

export const TotalStatistic = (props: Props) => {
  const { data, style } = props;

  return (
    <Row justify="space-between" style={style}>
      {data.map(({ title, value }) => (
        <AntdStatistic key={title} title={title} value={value} groupSeparator="" />
      ))}
    </Row>
  );
};
