import React from "react";
import { Button, Space, Statistic as AntdStatistic } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { getIsNowYear, getIsStartYear } from "../services/year";

type Props = {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
};

export const YearSwitch = (props: Props) => {
  const { selectedYear, setSelectedYear } = props;
  return (
    <Space size="small">
      <Button
        icon={<LeftOutlined />}
        onClick={() => setSelectedYear(selectedYear - 1)}
        disabled={getIsStartYear(selectedYear)}
        size="small"
      />
      <AntdStatistic title="Год" value={selectedYear} groupSeparator="" />
      <Button
        icon={<RightOutlined />}
        onClick={() => setSelectedYear(selectedYear + 1)}
        disabled={getIsNowYear(selectedYear)}
        size="small"
      />
    </Space>
  );
};
