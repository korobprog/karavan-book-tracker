import React from "react";
import { Select, SelectProps, RefSelectProps } from "antd";
import { HolderTransferMap, HolderTransferType } from "../services/api/holderTransfer";
import { HolderType } from "../services/api/holders";

const selectebleStockTransferTypes = [
  HolderTransferType.bbtIncome,
  HolderTransferType.adjustment,
  HolderTransferType.move,
  HolderTransferType.donations,
  HolderTransferType.found,
];

export type DistributorTransferType =
  | HolderTransferType.installments
  | HolderTransferType.sale
  | HolderTransferType.report
  | HolderTransferType.reportByMoney
  | HolderTransferType.return;

const selectebleDistributorTransferTypes = [
  HolderTransferType.installments,
  HolderTransferType.sale,
  HolderTransferType.report,
  HolderTransferType.return,
];

const stockTransferTypes = selectebleStockTransferTypes.map((type) => ({
  id: type,
  title: HolderTransferMap[type].title,
}));

const distributorTransferTypes = selectebleDistributorTransferTypes.map((type) => ({
  id: type,
  title: HolderTransferMap[type].title,
}));

const transferTypes = {
  [HolderType.distributor]: distributorTransferTypes,
  [HolderType.stock]: stockTransferTypes,
};

type TransferTypeSelectProps = SelectProps & {
  type: HolderType;
};

export const TransferTypeSelect = React.forwardRef<RefSelectProps, TransferTypeSelectProps>(
  (props, ref) => {
    const { type, ...restProps } = props;
    const options = transferTypes[type].map((d) => (
      <Select.Option key={d.id}>{d.title}</Select.Option>
    ));

    return (
      <Select ref={ref} placeholder="Выберете из вариантов" {...restProps}>
        {options}
      </Select>
    );
  }
);
export { HolderTransferType };
