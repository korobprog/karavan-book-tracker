import React from "react";
import { Avatar, Button, Divider, QRCode, Typography } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { CreditCardOutlined } from "@ant-design/icons";
import avatar from "../img/varnag_avatar.png";

export const VarnaG = () => {
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
        <Avatar size={80} src={<img src={avatar} alt="Владислав" />} />
      </div>
      <Title className="site-page-title" level={4}>
        Vladislav Nikolaevich M
      </Title>
      <Text strong>Gocha Afciauri TBS</Text>
      <Paragraph copyable>
        <CreditCardOutlined />
        <Text style={{ fontSize: "150%" }} code>
          22001023396
        </Text>
      </Paragraph>
      <Divider dashed />
      <Text>Donation leave here</Text>
      <div id="myqrcode">
        <QRCode
          className="centred"
          value="https://books-donation.web.app/varnag"
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
          <a href="https://books-donation.web.app/varnag">www.books-donation.web.app/varnag</a>
        </Text>
      </Paragraph>
    </BaseLayout>
  );
};
