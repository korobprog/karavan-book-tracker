import React from "react";
import { Divider, QRCode, Typography, Image, Avatar, Button } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { CreditCardOutlined } from "@ant-design/icons";
import telegram from "../img/telegram-svgrepo-com.svg";
import avatar from "../img/evgeny_avatar.jpg";

export const EvgenyK = () => {
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
        <Avatar size={80} src={<img src={avatar} alt="Евгений" />} />
      </div>
      <Title className="site-page-title" level={4}>
        Evgeny Kovalsky
      </Title>
      <Text strong>Gocha Afciauri TBS</Text>
      <Paragraph copyable>
        <CreditCardOutlined />
        <Text style={{ fontSize: "150%" }} code>
          22001023396
        </Text>
      </Paragraph>
      <Text strong>Tinkoff</Text>
      <Paragraph copyable>
        <CreditCardOutlined />
        <Text style={{ fontSize: "150%" }} code>
          5536914106233152
        </Text>
      </Paragraph>
      <Divider dashed />
      <Text>My contacts</Text>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paragraph>
          <a href="https://t.me/+87QpmUsO_Gw2NDNi">
            <Image alt="telegram" src={telegram} height={30} width={30} preview={false} />
          </a>
        </Paragraph>
      </div>
      <Text>Donation leave here</Text>
      <div id="myqrcode">
        <QRCode
          className="centred"
          value="https://books-donation.web.app/evgenyk"
          bgColor="#fff"
          style={{ marginBottom: 16 }}
        />
        <Button className="centred" type="primary" onClick={downloadQRCode}>
          Download QR
        </Button>
      </div>
      <Divider dashed />
      <Paragraph copyable>
        <Text>
          <a href="https://books-donation.web.app/evgenyk">www.books-donation.web.app/evgenyk</a>
        </Text>
      </Paragraph>
    </BaseLayout>
  );
};
