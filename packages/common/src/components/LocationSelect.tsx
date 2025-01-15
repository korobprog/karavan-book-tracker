import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Select, SelectProps, Typography, RefSelectProps } from "antd";

type LocationSelectProps = SelectProps & {
  onAddNewLocation: () => void;
  locationSearchString: string;
  isOnline?: boolean;
  loading?: boolean;
  onAddLocation: (location: string) => void;
};

export const LocationSelect = React.forwardRef<RefSelectProps, LocationSelectProps>(
  (props, ref) => {
    const {
      onAddNewLocation,
      onAddLocation,
      locationSearchString,
      children,
      isOnline,
      loading,
      ...restProps
    } = props;

    return (
      <Select
        ref={ref}
        showSearch
        placeholder="Начните вводить..."
        defaultActiveFirstOption={false}
        autoClearSearchValue={false}
        suffixIcon={null}
        filterOption={false}
        allowClear
        notFoundContent={
          !loading && (
            <>
              <Typography.Paragraph style={{ whiteSpace: "nowrap" }}>
                Такого места пока нет
              </Typography.Paragraph>

              {isOnline ? (
                <Typography.Link
                  onClick={() => {
                    onAddLocation(locationSearchString);
                  }}
                  style={{ whiteSpace: "nowrap" }}
                >
                  <PlusOutlined /> Добавить "{locationSearchString}"
                </Typography.Link>
              ) : (
                <Typography.Text>
                  Пока вы оффлайн нельзя добавить город, подключите интернет и проверьте, возможно
                  такой город уже есть в базе
                </Typography.Text>
              )}
            </>
          )
        }
        {...restProps}
      >
        {children}
      </Select>
    );
  }
);
