import React from "react";
import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

type Props = {
  title: string;
};

export const Helper = ({ title }: Props) => {
  return (
    <Tooltip title={title}>
      <span>
        <QuestionCircleOutlined />
      </span>
    </Tooltip>
  );
};
