import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Select, SelectProps, Typography } from "antd";

type LocationSelectProps = SelectProps & {
  onAddNewLocation: () => void;
  locationSearchString: string;
  isOnline?: boolean;
  loading?: boolean;
};

export const LocationSelect: React.FC<LocationSelectProps> = (props) => {
  const { onAddNewLocation, locationSearchString, children, isOnline, loading, ...restProps } =
    props;

  return (
    <Select
      showSearch
      placeholder="Начните вводить..."
      defaultActiveFirstOption={false}
      autoClearSearchValue={false}
      showArrow={false}
      filterOption={false}
      allowClear
      notFoundContent={
        !loading && <>
          <Typography.Paragraph style={{ whiteSpace: "nowrap" }}>
            Такого места пока нет
          </Typography.Paragraph>

          {isOnline ? (
            <Typography.Link onClick={onAddNewLocation} style={{ whiteSpace: "nowrap" }}>
              <PlusOutlined />
              Добавить "{locationSearchString}"
            </Typography.Link>
          ) : (
            <Typography.Text>
              Пока вы оффлайн нельзя добавить город, подключите интернет и проверьте, возможно такой
              город уже есть в базе
            </Typography.Text>
          )}
        </>
      }
      {...restProps}
    >
      {children}
    </Select>
  );
};
