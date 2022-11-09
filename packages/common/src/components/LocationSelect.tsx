import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Select, SelectProps, Typography } from "antd";

type LocationSelectProps = SelectProps & {
  onAddNewLocation: () => void;
  locationSearchString: string;
};

export const LocationSelect: React.FC<LocationSelectProps> = (props) => {
  const { onAddNewLocation, locationSearchString, children, ...restProps } = props;
  return (
    <Select
      showSearch
      placeholder="Начните вводить..."
      defaultActiveFirstOption={false}
      autoClearSearchValue={false}
      showArrow={false}
      filterOption={false}
      notFoundContent={
        <>
          <Typography.Paragraph style={{ whiteSpace: "nowrap" }}>
            Такого места пока нет, можете его добавить
          </Typography.Paragraph>
          <Typography.Link
            onClick={onAddNewLocation}
            style={{ whiteSpace: "nowrap" }}
          >
            <PlusOutlined />
            Добавить "{locationSearchString}"
          </Typography.Link>
        </>
      }
      {...restProps}
    >
      {children}
    </Select>
  );
};
