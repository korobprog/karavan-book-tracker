import React from "react";
import { Select, SelectProps, RefSelectProps } from "antd";
import { HolderTransferMap, HolderTransferType } from "../services/api/holderTransfer";

const selectebleTransferTypes = [
  HolderTransferType.bbtIncome,
  HolderTransferType.adjustment,
  HolderTransferType.move,
  HolderTransferType.donations,
  HolderTransferType.return,
  HolderTransferType.found,
];

const transferTypes = selectebleTransferTypes.map((type) => ({
  id: type,
  name: HolderTransferMap[type].name,
}));

type TransferTypeSelectProps = SelectProps & {};

export const TransferTypeSelect = React.forwardRef<RefSelectProps, TransferTypeSelectProps>(
  (props, ref) => {
    const options = transferTypes.map((d) => <Select.Option key={d.id}>{d.name}</Select.Option>);

    return (
      <Select ref={ref} placeholder="Выберете из вариантов" showArrow={true} {...props}>
        {options}
      </Select>
    );
  }
);
export { HolderTransferType };
