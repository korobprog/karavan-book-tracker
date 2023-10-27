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
  const plug = !pageId || !initialValues.active;
  console.log("🚀 ~ file: page.tsx:49 ~ Page ~ plug:", plug);
  return (
    <BaseLayout title="Book Donation" headerActions={[]} avatar={avatar}>
      {plug ? (
        <PageExist />
      ) : (
        <>
          <Space style={{ display: "flex", justifyContent: "center" }}>
            <Avatar size={80} src={<img src={avatar} alt="Евгений" />} />
          </Space>
          <Title className="site-page-title" level={4}>
            здесь имя
          </Title>
          {initialValues.banks.map(({ bankName, cardNumber, qrLink }) => (
            <Space
              key={bankName}
              style={{
                display: "flex",
                marginBottom: 8,
                flexFlow: "column nowrap",
                justifyContent: "center",
                alignItems: "center",
              }}
              align="baseline"
            >
              <Text strong>{bankName}</Text>
              <Paragraph copyable>
                <CreditCardOutlined />
                <Text style={{ fontSize: "150%" }} code>
                  {cardNumber}
                </Text>
              </Paragraph>
              {qrLink && (
                <QRCode
                  className="centred"
                  value={qrLink}
                  bgColor="#fff"
                  style={{ marginBottom: 16 }}
                />
              )}
            </Space>
          ))}
          <Divider dashed />
          <Space
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              alignContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Text>My contacts</Text>

            <Paragraph>
              <a href={initialValues.socialTelegram}>
                <Image alt="socialTelegram" src={telegram} height={30} width={30} preview={false} />
              </a>
              <Link style={{ marginLeft: 5 }} href={initialValues.socialTelegram} target="_blank">
                {initialValues.socialTelegram}
              </Link>
            </Paragraph>

            <Paragraph>
              <a href={initialValues.socialWhats}>
                <Image alt="socialWhats" src={whats} height={30} width={30} preview={false} />
              </a>
              <Link
                style={{ marginLeft: 5 }}
                href={`tel:${initialValues.socialWhats}`}
                target="_blank"
              >
                {initialValues.socialWhats}
              </Link>
            </Paragraph>

            <Paragraph>
              <a href={initialValues.socialLink}>
                <Image alt="socialLink" src={email} height={30} width={30} preview={false} />
              </a>
              <Link
                style={{ marginLeft: 5 }}
                href={`mailto:${initialValues.socialLink}`}
                target="_blank"
              >
                {initialValues.socialLink}
              </Link>
            </Paragraph>
            <Text>Donation leave here</Text>
          </Space>
          <div id="myqrcode">
            <QRCode
              className="centred"
              value={`${window.location.href}${pageId}`}
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
