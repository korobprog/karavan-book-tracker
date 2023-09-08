import React from "react";
import { Select, SelectProps, RefSelectProps } from "antd";
const transferTypes = [
  {
    id: "bbt-income",
    name: "Приход из ББТ",
  },
  {
    id: "adjustment",
    name: "Корректировка",
  },
  {
    id: "move",
    name: "Перемещение",
  },
  {
    id: "donations",
    name: "Пожертвования",
  },
  {
    id: "return",
    name: "Возврат",
  },
  {
    id: "found",
    name: "Нашли",
  },
];
type TransferTypeSelectProps = SelectProps & {};

export const TransferTypeSelect = React.forwardRef<RefSelectProps, TransferTypeSelectProps>(
  (props, ref) => {
    const options = transferTypes.map((d) => <Select.Option key={d.id}>{d.name}</Select.Option>);

    return (
      <Select
        ref={ref}
        placeholder="Выберете из вариантов"
        showArrow={true}
        defaultValue={transferTypes[0].id}
        defaultActiveFirstOption
        {...props}
      >
        {options}
      </Select>
    );
  }
);
