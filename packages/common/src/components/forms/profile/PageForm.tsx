import React from "react";
import { Button, Form, Input, Space, Tooltip, Typography, Image, Divider } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { DonationPageDoc } from "common/src/services/api/donation";
import { InfoCircleOutlined } from "@ant-design/icons";
import telegram from "common/src/images/telegram.svg";
import whats from "common/src/images/whatsapp.svg";
import email from "common/src/images/email.svg";

export type PageFormValues = DonationPageDoc;

type Props<FormValues> = {
  onFinish: (formValues: FormValues) => Promise<void>;
  initialValues?: FormValues;
  disabled?: boolean;
};

export const PageForm = <FormValues extends PageFormValues>(props: Props<FormValues>) => {
  const { onFinish, initialValues, disabled } = props;

  const { Text } = Typography;
  return (
    <Form
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      autoComplete="off"
      initialValues={initialValues}
    >
      <Form.List name="banks">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, "bankName"]}
                  rules={[{ required: true, message: "Введите название банка" }]}
                >
                  <Input disabled={disabled} placeholder="Введите название банка" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "cardNumber"]}
                  rules={[{ required: true, message: "Введите номер карты" }]}
                >
                  <Input disabled={disabled} placeholder="Номер карты" />
                </Form.Item>
                <Form.Item {...restField} name={[name, "qrLink"]}>
                  <Input
                    suffix={
                      <Tooltip title="Скопируйте ссылку с Вашего банковского приложения">
                        <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                      </Tooltip>
                    }
                    disabled={disabled}
                    placeholder="Ссылка на QR"
                  />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                disabled={disabled}
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Добавить новые реквезиты
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Divider dashed />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexFlow: "column nowrap",
          alignItems: "center",
          alignContent: "center",
          height: 100,
        }}
      >
        <Space>
          <Image
            style={{ position: "absolute", top: -10, left: 5 }}
            alt="telegram"
            src={telegram}
            height={30}
            width={30}
            preview={false}
          />
          <Form.Item name="socialTelegram">
            <Input disabled={disabled} placeholder="ссылка на ваш Telegram" />
          </Form.Item>
        </Space>
        <Space>
          <Image
            style={{ position: "absolute", top: -10, left: 5 }}
            alt="whats"
            src={whats}
            height={30}
            width={30}
            preview={false}
          />
          <Form.Item name="socialWhats">
            <Input disabled={disabled} placeholder="ссылка на ваш Whats" />
          </Form.Item>
        </Space>
        <Space>
          <Image
            style={{ position: "absolute", top: -10, left: 5 }}
            alt="email"
            src={email}
            height={30}
            width={30}
            preview={false}
          />
          <Form.Item name="socialLink">
            <Input disabled={disabled} placeholder="другие ссылки" />
          </Form.Item>
        </Space>
      </div>
      <Divider dashed />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          СОХРАНИТЬ
        </Button>
      </Form.Item>
    </Form>
  );
};
