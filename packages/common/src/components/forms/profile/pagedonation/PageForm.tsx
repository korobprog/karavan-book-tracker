import React, { useEffect, useState } from "react";
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
  Alert,
  Radio,
  RadioChangeEvent,
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
import printPdfDonations88 from "./printPdfDonations88";

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

  const title = {
    titleBank: "Введите названия банка",
    titleCard: "Введите номер карты",
    titleQr: "Введите сслыку на QR",
    titleButton: "Введите свое название",
  };

  const [value, setValue] = useState(true);
  console.log("🚀 ~ file: PageForm.tsx:82 ~ PageForm ~ value:", value);

  const onChange = (e: RadioChangeEvent) => {
    //console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  return (
    <Form
      name="pageDonationForm"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={initialValues}
      layout="vertical"
    >
      <Space style={{ display: "flex", flexFlow: "column", alignItems: "flex-end" }}>
        <Form.Item name={"active"}>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={switchState}
            onChange={handleSwitchChange}
          />
        </Form.Item>
      </Space>

      <Alert
        message="Настройте страницу визитки"
        description="Вы можете настроить свою страничку пожертвований, а также распечать QR
      коды для книг в качестве Ваших визиток."
        type="info"
        showIcon
      />

      <Space
        direction="horizontal"
        style={{
          display: "flex",
          marginBottom: 15,
          flexFlow: "column",
          alignItems: "center",
          marginTop: 25,
        }}
      >
        <Form.Item>
          <Button type="primary" htmlType="submit">
            СОХРАНИТЬ
          </Button>
        </Form.Item>
        {switchState ? (
          <Button type="primary" ghost>
            <Link copyable={{ text: myPageLink }} href={myPageLink} target="_blank">
              Ваша страница визитки
            </Link>
          </Button>
        ) : (
          ""
        )}
      </Space>

      {switchState ? (
        <Space
          direction="vertical"
          style={{ display: "flex", flexFlow: "column", alignItems: "center", marginBottom: 15 }}
        >
          <Radio.Group name="radiogroup" defaultValue={1} onChange={onChange} value={value}>
            <Radio value={true}>16 QR</Radio>
            <Radio value={false}>88 QR</Radio>
          </Radio.Group>
          <Button type="primary" ghost icon={<PrinterTwoTone />}>
            <Link onClick={value ? printPdfDonations : printPdfDonations88} target="_blank">
              распечатать визитки
            </Link>
          </Button>
        </Space>
      ) : (
        ""
      )}

      <Form.Item name={"greetingText"} label="Текст приветствия">
        <TextArea
          showCount
          maxLength={200}
          placeholder="Введите текст приветствия, либо оставьте пустым, по умолчанию будет написанно - Вы можете пожертвовать на печать и выкуп книг"
          style={{ height: 120, resize: "none" }}
        />
      </Form.Item>

      <Form.List name="banks">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key}>
                <Tooltip
                  trigger={["focus"]}
                  placement="top"
                  overlayClassName="numeric-input"
                  title={title.titleBank}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "bankName"]}
                    rules={[{ required: true, message: "Введите название банка" }]}
                    label="Банк"
                  >
                    <Input disabled={disabled} placeholder="Банк..." />
                  </Form.Item>
                </Tooltip>
                <Tooltip
                  trigger={["focus"]}
                  placement="top"
                  overlayClassName="numeric-input"
                  title={title.titleCard}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "cardNumber"]}
                    rules={[
                      {
                        required: false,
                      },
                    ]}
                    label="№ карты"
                  >
                    <Input disabled={disabled} placeholder="99009..." />
                  </Form.Item>
                </Tooltip>
                <Tooltip
                  trigger={["focus"]}
                  placement="top"
                  overlayClassName="numeric-input"
                  title={title.titleQr}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "qrLink"]}
                    initialValue=""
                    label="cсылка на QR"
                  >
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
                Добавить новые реквизиты
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Tooltip
        trigger={["focus"]}
        placement="topLeft"
        overlayClassName="numeric-input"
        title={title.titleButton}
      >
        <Form.Item
          name="buttonBank"
          label="Текст кнопки
"
        >
          <Input
            disabled={disabled}
            placeholder="По умолчанию - Пожертвуйте на выкуп книг от сердца"
          />
        </Form.Item>
      </Tooltip>
      <Divider dashed />
      <Text italic>Здесь Вы можете указать свои контакты и ссылки:</Text>
      <Space style={{ marginTop: 15 }}>
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
        <Space id="myqrcode">
          <Text italic>{userName}, это Ваш QR странички донатов</Text>
          <Space
            direction="vertical"
            style={{ marginTop: 15, display: "flex", alignItems: "center" }}
          >
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
            <Button type="primary" onClick={downloadQRCode}>
              Скачать QR на устройство
            </Button>
          </Space>
        </Space>
      ) : (
        ""
      )}
      <Divider dashed />
      <Space direction="vertical" style={{ marginTop: 15, display: "flex", alignItems: "center" }}>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            СОХРАНИТЬ
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
};
