import React from "react";
import { Divider, QRCode, Typography, Image, Avatar, Button, Space } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { BankOutlined, CreditCardOutlined } from "@ant-design/icons";
import telegram from "../img/telegram-svgrepo-com.svg";
import avatar from "../img/olga_k.jpg";
import logoTinkoff from "../img/tinkoff_logo.svg";
import logoSber from "../img/sberbank-logo.svg";

export const OlgaK = () => {
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
  const { Title } = Typography;
  const { Paragraph, Text } = Typography;
  return (
    <BaseLayout title="Book Donation" headerActions={[]}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Avatar size={80} src={<img src={avatar} alt="Ольга" />} />
      </div>
      <Title className="site-page-title" level={4}>
        Krasanova Olga
      </Title>

      <Divider dashed />
      <Image preview={false} alt="Tinkoff" src={logoTinkoff} width={150} />
      {/*    <Paragraph copyable>
        <Space align="center">
          <BankOutlined />
          <Button href="https://www.tinkoff.ru/rm/korobkov.maksim37/xORxX45790">
            ПЕРЕВОД ЧЕРЕЗ TINKOFF
          </Button>
        </Space>
      </Paragraph> */}

      <Paragraph>
        <Space align="center">
          <BankOutlined />
          <CreditCardOutlined />
          <Text copyable style={{ fontSize: "150%" }} code>
            2200700520451401
          </Text>
        </Space>
      </Paragraph>
      <Divider dashed />
      <Image preview={false} alt="Sber" src={logoSber} width={150} />
      <Paragraph>
        <Space align="center">
          <BankOutlined />
          <CreditCardOutlined />
          <Text copyable style={{ fontSize: "150%" }} code>
            2202206323240833
          </Text>
        </Space>
      </Paragraph>

      <Divider dashed />
      <Text>My contacts</Text>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paragraph>
          <a href="https://t.me/Gauravani_dd">
            <Image alt="telegram" src={telegram} height={30} width={30} preview={false} />
            t.me/Gauravani_dd
          </a>
        </Paragraph>
      </div>
      <Text>Donation leave here</Text>
      <div id="myqrcode">
        <QRCode
          className="centred"
          value="https://books-donation.web.app/olgak"
          bgColor="#fff"
          style={{ marginBottom: 16 }}
        />
        <Button className="centred" type="primary" onClick={downloadQRCode}>
          Download QR
        </Button>
      </div>
      <Divider dashed />
      <Paragraph>
        <Text>
          <a href="https://books-donation.web.app/olgak">www.books-donation.web.app/olgak</a>
        </Text>
      </Paragraph>
    </BaseLayout>
  );
};
