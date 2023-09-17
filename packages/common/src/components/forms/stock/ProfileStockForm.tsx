import React from "react";
import { Form, Input } from "antd";

export type ProfileStockFormValues = {
  stockName: string;
};

type Props = {};

export const ProfileStockForm = (props: Props) => {
  return (
    <>
      <Form.Item name="stockName" label="Название склада" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </>
  );
};
