import { Form, Input, Select } from "antd";

import { bbtRegions } from "../../../services/regions";

export type ProfileStockFormValues = {
  stockName: string;
  region?: string;
};

type Props = {};

export const ProfileStockForm = (props: Props) => {
  return (
    <>
      <Form.Item name="stockName" label="Название склада" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="region" label="Регион" rules={[{ required: true }]}>
        <Select options={bbtRegions} allowClear />
      </Form.Item>
    </>
  );
};
