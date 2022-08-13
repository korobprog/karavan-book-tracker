import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Select, SelectProps, Typography } from "antd";

type UserSelectProps = SelectProps & {
  onAddNewUser: () => void;
  userSearchString: string;
};

export const UserSelect: React.FC<UserSelectProps> = (props) => {
  const { onAddNewUser, userSearchString, children, ...restProps } = props;
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
            Такого пользователя пока нет. Вы можете его добавить на отдельной
            странице
          </Typography.Paragraph>
          <Typography.Link
            onClick={onAddNewUser}
            style={{ whiteSpace: "nowrap" }}
          >
            <PlusOutlined />
            Добавить нового пользователя
          </Typography.Link>
        </>
      }
      {...restProps}
    >
      {children}
    </Select>
  );
};
