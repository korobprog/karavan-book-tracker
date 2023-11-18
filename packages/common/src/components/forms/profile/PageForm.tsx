import React, { useState } from "react";
import { Button, Form, Input, Space, Tooltip, Image, Divider, Switch, Typography } from "antd";
import { MinusCircleOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DonationPageDoc } from "common/src/services/api/donation";
import { InfoCircleOutlined } from "@ant-design/icons";
import telegram from "common/src/images/telegram.svg";
import whats from "common/src/images/whatsapp.svg";
import email from "common/src/images/email.svg";
import { CurrentUser } from "common/src/services/api/useCurrentUser";

export type PageFormValues = DonationPageDoc;

type Props = {
  onFinish: (formValues: PageFormValues) => Promise<void>;
  initialValues: PageFormValues;
  disabled?: boolean;
  currentUser: CurrentUser;
};

export const PageForm = (props: Props) => {
  const { onFinish, initialValues, disabled } = props;
  const { currentUser } = props;

  const userId = currentUser.profile?.id || currentUser.user?.uid;

  const [switchState, setSwitchState] = useState(initialValues.active);

  const handleSwitchChange = (checked: boolean | ((prevState: boolean) => boolean)) => {
    setSwitchState(checked);
  };

  const { Link } = Typography;
  const myPageLink = `https://books-donation.web.app/page/${userId}`;

  return (
    <Form
      name="pageDonationForm"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      autoComplete="off"
      initialValues={initialValues}
    >
      <Space>
        <Link copyable={{ text: myPageLink }} href={myPageLink} target="_blank">
          Ваша страница
        </Link>
      </Space>
      <Form.Item name={"active"} label="Активировать страницу">
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          checked={switchState}
          onChange={handleSwitchChange}
        />
      </Form.Item>
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
                  <Input disabled={disabled} placeholder="Банк" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "cardNumber"]}
                  rules={[{ required: true, message: "Введите номер карты" }]}
                >
                  <Input disabled={disabled} placeholder="№-карты" />
                </Form.Item>
                <Form.Item {...restField} name={[name, "qrLink"]} initialValue="">
                  <Input
                    suffix={
                      <Tooltip title="Скопируйте ссылку с Вашего банковского приложения">
                        <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                      </Tooltip>
                    }
                    disabled={disabled}
                    placeholder="QR"
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
          height: 200,
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
            <Input
              disabled={disabled}
              placeholder="ссылка на Telegram"
              suffix={
                <Tooltip title="Пример: https://t.me/ваш_догин">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
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
            <Input
              disabled={disabled}
              placeholder="ссылка на Whats"
              suffix={
                <Tooltip title="Пример: 7xxxxxxxx">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
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
            <Input
              disabled={disabled}
              placeholder="другие ссылки"
              suffix={
                <Tooltip title="Пример: mymail@mail.com">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>
        </Space>
      </div>
      <Divider dashed />
      <Form.Item>
        <Button type="primary" htmlType="submit">
          СОХРАНИТЬ
        </Button>
      </Form.Item>
      <Space
        style={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          alignContent: "center",
          alignItems: "flex-start",
        }}
      ></Space>
    </Form>
  );
};