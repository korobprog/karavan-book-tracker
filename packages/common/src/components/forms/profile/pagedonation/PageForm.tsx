import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Space,
  Tooltip,
  Image,
  Divider,
  Switch,
  Typography,
  QRCode,
} from "antd";
import { PrinterTwoTone } from "@ant-design/icons";
import { MinusCircleOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DonationPageDoc } from "common/src/services/api/donation";
import { InfoCircleOutlined } from "@ant-design/icons";
import telegram from "common/src/images/telegram.svg";
import whats from "common/src/images/whatsapp.svg";
import email from "common/src/images/email.svg";
import link from "common/src/images/link_b.svg";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import logo from "../../../../images/logo.png";
import printPdfDonations from "./printPdfDonations";
import { Preview } from "./preview";

const QR_SIZE = 160;

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
  const userName = currentUser.profile?.name;

  const [switchState, setSwitchState] = useState(initialValues.active);

  const handleSwitchChange = (checked: boolean | ((prevState: boolean) => boolean)) => {
    setSwitchState(checked);
  };

  const { Link } = Typography;
  const myPageLink = `https://books-donation.web.app/page/${userId}`;

  const { Text } = Typography;
  const { TextArea } = Input;

  const downloadQRCode = () => {
    const canvas = document.getElementById("myqrcode")?.querySelector<HTMLCanvasElement>("canvas");
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement("a");
      a.download = "QRCode.png";
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const titleBank = "Введите названия банка";
  const titleCard = "Введите номер карты";
  const titleQr = "Введите сслыку на QR";

  return (
    <Form
      name="pageDonationForm"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      autoComplete="off"
      initialValues={initialValues}
    >
      <Text keyboard>
        {userName}, Здесь Вы можете настроить свою страничку пожертвований, а также распечать QR
        коды для книг в качестве Ваших визток.
      </Text>
      <Form.Item
        name={"active"}
        label="Включите/выключите чтобы активировать страницу пожертвований"
      >
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          checked={switchState}
          onChange={handleSwitchChange}
        />
      </Form.Item>
      {switchState ? (
        <Space style={{ marginLeft: 30, marginBottom: 15 }}>
          <Button type="primary" ghost>
            <Link copyable={{ text: myPageLink }} href={myPageLink} target="_blank">
              Ваша страница визитки
            </Link>
          </Button>
        </Space>
      ) : (
        ""
      )}
      {switchState ? (
        <Space style={{ marginLeft: 30, marginBottom: 25 }}>
          <Button type="primary" ghost icon={<PrinterTwoTone />}>
            <Link onClick={printPdfDonations} target="_blank">
              распечатать визитки
            </Link>
          </Button>
        </Space>
      ) : (
        ""
      )}
      <Form.Item name={"greetingText"}>
        Введите текст приветствия, либо оставьте пустым, по умолчанию будет написанно - "Вы можете
        пожертвовать на печать и выкуп книг"
        <TextArea
          showCount
          maxLength={200}
          placeholder="Написать приветствие на Вашей страничке донатов"
          style={{ height: 120, resize: "none" }}
        />
      </Form.Item>
      Введите реквизыты - название банка, номер банковской карты и ссылку на QR код с вашего
      банковского приложения:
      <Form.List name="banks">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                <Tooltip
                  trigger={["focus"]}
                  placement="topLeft"
                  overlayClassName="numeric-input"
                  title={titleBank}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "bankName"]}
                    rules={[{ required: true, message: "Введите название банка" }]}
                  >
                    <Input disabled={disabled} placeholder="Банк..." />
                  </Form.Item>{" "}
                </Tooltip>
                <Tooltip
                  trigger={["focus"]}
                  placement="topLeft"
                  overlayClassName="numeric-input"
                  title={titleCard}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "cardNumber"]}
                    rules={[{ required: false, message: "Введите номер карты" }]}
                  >
                    <Input disabled={disabled} placeholder="99009..." />
                  </Form.Item>
                </Tooltip>
                <Tooltip
                  trigger={["focus"]}
                  placement="topLeft"
                  overlayClassName="numeric-input"
                  title={titleQr}
                >
                  <Form.Item {...restField} name={[name, "qrLink"]} initialValue="">
                    <Input
                      suffix={
                        <Tooltip title="Скопируйте ссылку с Вашего банковского приложения">
                          <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                        </Tooltip>
                      }
                      disabled={disabled}
                      placeholder="http://site..."
                    />
                  </Form.Item>
                </Tooltip>
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
      <Space>
        <Text italic>Текст кнопки - перевода онлайн</Text>
        <Form.Item name="buttonBank">
          <Input
            disabled={disabled}
            placeholder="OnlinePay"
            suffix={
              <Tooltip title="OnlinePay...">
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
        </Form.Item>
      </Space>
      <Divider dashed />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexFlow: "column nowrap",
          alignItems: "center",
          alignContent: "center",
          height: 550,
        }}
      >
        <Text italic>Здесь Вы можете ввести свои контактные данные:</Text>
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
              addonBefore="https://t.me/"
              disabled={disabled}
              placeholder="ссылка на Telegram"
              suffix={
                <Tooltip title="Пример: mylogin">
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
          <Form.Item name="socialMail">
            <Input
              disabled={disabled}
              placeholder="eMail"
              suffix={
                <Tooltip title="Пример: mymail@mail.com">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>
        </Space>
        <Space>
          <Image
            style={{ position: "absolute", top: -10, left: 5 }}
            alt="link"
            src={link}
            height={30}
            width={30}
            preview={false}
          />
          <Form.Item name="socialLink">
            <Input
              disabled={disabled}
              placeholder="другие ссылки"
              suffix={
                <Tooltip title="Пример: www.exemple.com">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>
        </Space>
        {switchState ? (
          <div id="myqrcode">
            <Text italic>{userName}, это Ваш QR странички донатов</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
              errorLevel="H"
              size={QR_SIZE}
              iconSize={QR_SIZE / 4}
              icon={logo}
            />
            <Button className="centred" type="primary" onClick={downloadQRCode}>
              Скачать QR на устройство
            </Button>
          </div>
        ) : (
          ""
        )}
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
      </div>
    </Form>
  );
};
