import React from "react";
import { useStore } from "effector-react";
import { PlusOutlined } from "@ant-design/icons";
import { Select, SelectProps, Typography } from "antd";
import { $isOnline } from "../app/offline/lib/isOnlineStore";

type LocationSelectProps = SelectProps & {
  onAddNewLocation: () => void;
  locationSearchString: string;
};

export const LocationSelect: React.FC<LocationSelectProps> = (props) => {
  const { onAddNewLocation, locationSearchString, children, ...restProps } = props;
  const isOnline = useStore($isOnline);

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
        <>
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
