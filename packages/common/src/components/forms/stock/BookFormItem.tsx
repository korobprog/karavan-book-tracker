import React from "react";
import { Button, List, InputNumber, Form, Space } from "antd";
import { PlusOutlined, MinusOutlined, SelectOutlined } from "@ant-design/icons";

export type BookFormItemProps = {
  title: string;
  description: string;
  isSelected: boolean;
  minCount: number;
  maxCount: number;
  bookCount: number;
  bookId: string;
  leftSlot?: React.ReactNode;
  bottomSlor?: React.ReactNode;
  onMinusClick: (bookId: string, minCount: number) => void;
  onPlusClick: (bookId: string, maxCount: number) => void;
  onSelectClick: (bookId: string) => void;
};

export const BookFormItem = (props: BookFormItemProps) => {
  const {
    bookId,
    title,
    description,
    isSelected,
    leftSlot,
    bottomSlor,
    minCount,
    maxCount,
    bookCount,
  } = props;
  const { onSelectClick, onMinusClick, onPlusClick } = props;
  return (
    <List.Item>
      <List.Item.Meta title={title} description={description} />
      <Space>
        {isSelected ? (
          <Space direction="vertical" align="end">
            <Space>
              {leftSlot}
              <Button
                onClick={() => onMinusClick(bookId, minCount)}
                icon={<MinusOutlined />}
                disabled={bookCount === minCount}
              />
              <Form.Item name={bookId} noStyle>
                <InputNumber
                  min={minCount}
                  max={maxCount}
                  style={{ width: 70 }}
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                />
              </Form.Item>
              <Button
                onClick={() => onPlusClick(bookId, maxCount)}
                icon={<PlusOutlined />}
                disabled={bookCount === maxCount}
              />
            </Space>
            {bottomSlor}
          </Space>
        ) : (
          <Button onClick={() => onSelectClick(bookId)} icon={<SelectOutlined />}>
            Выбрать
          </Button>
        )}
      </Space>
    </List.Item>
  );
};
