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
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { routes } from "../../../../../tracker/src/shared/routes";
import jsPDF from "jspdf";
import logo from "../image/book-danation.svg";

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
  const nameuser = currentUser.profile?.name;

  const [switchState, setSwitchState] = useState(initialValues.active);

  const handleSwitchChange = (checked: boolean | ((prevState: boolean) => boolean)) => {
    setSwitchState(checked);
  };

  const { Link } = Typography;
  const myPageLink = `https://books-donation.web.app/page/${userId}`;
  const [size] = useState<number>(160);

  const { Text } = Typography;

  return (
    <Form
      name="pageDonationForm"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      autoComplete="off"
      initialValues={initialValues}
    >
      {switchState ? (
        <Space>
          <Link copyable={{ text: myPageLink }} href={myPageLink} target="_blank">
            Ваша страница
          </Link>
        </Space>
      ) : (
        ""
      )}

      {switchState ? (
        <Space style={{ marginLeft: 30 }}>
          <Link onClick={PdfPrintDonations} target="_blank">
            распечатать визитки
          </Link>
          <PrinterTwoTone />
        </Space>
      ) : (
        ""
      )}

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
          height: 450,
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

        {switchState ? (
          <div id="myqrcode">
            <Text>{nameuser} это Ваш QR странички донатов</Text>
            <QRCode
              className="centred"
              value={myPageLink}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
              errorLevel="H"
              size={size}
              iconSize={size / 4}
              icon={logo}
            />
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

const PdfPrintDonations = () => {
  let url;
  const canvas = document.getElementById("myqrcode")?.querySelector<HTMLCanvasElement>("canvas");
  if (canvas) {
    url = canvas.toDataURL();
    const aref = document.createElement("a");
    aref.href = url;
    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });
    //vertical lines
    doc.line(335, 1, 335, 800);
    doc.line(225, 1, 225, 800);
    doc.line(115, 1, 115, 800);
    //Horizontal lines
    doc.line(500, 135, 1, 135);
    doc.line(500, 270, 1, 270);
    doc.line(500, 410, 1, 410);
    //1 first line
    doc.addImage(canvas, "JPEG", 10, 25, 100, 100);
    doc.text("Donate to books", 10, 20);
    doc.addImage(canvas, "JPEG", 120, 25, 100, 100);
    doc.text("Donate to books", 120, 20);
    doc.addImage(canvas, "JPEG", 230, 25, 100, 100);
    doc.text("Donate to books", 230, 20);
    doc.addImage(canvas, "JPEG", 340, 25, 100, 100);
    doc.text("Donate to books", 340, 20);
    //2 first line
    doc.addImage(canvas, "JPEG", 10, 160, 100, 100);
    doc.text("Donate to books", 10, 150);
    doc.addImage(canvas, "JPEG", 120, 160, 100, 100);
    doc.text("Donate to books", 120, 150);
    doc.addImage(canvas, "JPEG", 230, 160, 100, 100);
    doc.text("Donate to books", 230, 150);
    doc.addImage(canvas, "JPEG", 340, 160, 100, 100);
    doc.text("Donate to books", 340, 150);
    //3 first line
    doc.addImage(canvas, "JPEG", 10, 300, 100, 100);
    doc.text("Donate to books", 10, 290);
    doc.addImage(canvas, "JPEG", 120, 300, 100, 100);
    doc.text("Donate to books", 120, 290);
    doc.addImage(canvas, "JPEG", 230, 300, 100, 100);
    doc.text("Donate to books", 230, 290);
    doc.addImage(canvas, "JPEG", 340, 300, 100, 100);
    doc.text("Donate to books", 340, 290);
    //4 first line
    doc.addImage(canvas, "JPEG", 10, 435, 100, 100);
    doc.text("Donate to books", 10, 425);
    doc.addImage(canvas, "JPEG", 120, 435, 100, 100);
    doc.text("Donate to books", 120, 425);
    doc.addImage(canvas, "JPEG", 230, 435, 100, 100);
    doc.text("Donate to books", 230, 425);
    doc.addImage(canvas, "JPEG", 340, 435, 100, 100);
    doc.text("Donate to books", 340, 425);
    doc.save("print.pdf");
  }
};
