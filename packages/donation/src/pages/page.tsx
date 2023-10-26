import React from "react";
import { Divider, QRCode, Typography, Image, Avatar, Button, Space } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { BankOutlined, CreditCardOutlined } from "@ant-design/icons";
import avatar from "../img/evgeny_avatar.jpg";
import logoTinkoff from "../img/tinkoff_logo.svg";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useParams } from "react-router-dom";
import { routes } from "../shared/routes";
import { PageExist } from "./404";
import { DonationPageDoc } from "common/src/services/api/donation";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { apiRefs } from "common/src/services/api/refs";

import telegram from "common/src/images/telegram.svg";
import whats from "common/src/images/whatsapp.svg";
import email from "common/src/images/email.svg";

export const Page = () => {
  const initialPageDoc: DonationPageDoc = {
    banks: [],
    active: false,
    socialTelegram: "",
    socialWhats: "",
    socialLink: "",
  };

  const { pageId } = useParams<{ pageId: string }>();

  const [donationPageDocData] = useDocumentData<DonationPageDoc>(
    pageId ? apiRefs.donationPage(pageId) : null
  );
  const initialValues = donationPageDocData || initialPageDoc;

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
  const { Paragraph, Text, Link, Title } = Typography;
  return (
    <BaseLayout title="Book Donation" headerActions={[]} avatar={avatar}>
      {!pageId ? (
        <PageExist />
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Avatar size={80} src={<img src={avatar} alt="Евгений" />} />
          </div>
          <Title className="site-page-title" level={4}>
            здесь имя
          </Title>
          {initialValues.banks.map(({ bankName, cardNumber, qrLink }) => (
            <Space
              key={bankName}
              style={{ display: "flex", marginBottom: 8, flexFlow: "column nowrap" }}
              align="baseline"
            >
              <Text strong>{bankName}</Text>
              <Paragraph copyable>
                <CreditCardOutlined />
                <Text style={{ fontSize: "150%" }} code>
                  {cardNumber}
                </Text>
              </Paragraph>
              <QRCode
                className="centred"
                value={`${qrLink}`}
                bgColor="#fff"
                style={{ marginBottom: 16 }}
              />
            </Space>
          ))}
          <Divider dashed />
          <Text>My contacts</Text>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Paragraph>
              <a href={initialValues.socialTelegram}>
                <Image alt="telegram" src={telegram} height={30} width={30} preview={false} />
              </a>
              <Link style={{ marginLeft: 5 }} href={initialValues.socialTelegram} target="_blank">
                {initialValues.socialTelegram}
              </Link>
            </Paragraph>
          </div>
          <Text>Donation leave here</Text>
          <div id="myqrcode">
            <QRCode
              className="centred"
              value={`https://books-donation.web.app/${pageId}`}
              bgColor="#fff"
              style={{ marginBottom: 16 }}
            />
            <Button className="centred" type="primary" onClick={downloadQRCode}>
              Download QR
            </Button>
          </div>
          <Divider dashed />
        </>
      )}
    </BaseLayout>
  );
};
