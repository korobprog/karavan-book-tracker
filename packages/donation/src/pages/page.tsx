import React from "react";
import { Divider, QRCode, Typography, Image, Avatar, Button, Space } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { CreditCardOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
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
    avatarPage: "",
    nameUser: "",
  };

  const { pageId } = useParams<{ pageId: string }>();

  const [donationPageDocData] = useDocumentData<DonationPageDoc>(
    pageId ? apiRefs.donationPage(pageId) : null
  );
  const initialValues = donationPageDocData || initialPageDoc;
  const { socialTelegram, socialWhats, socialLink, avatarPage, nameUser } = initialValues;

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

  return (
    <BaseLayout title="Book Donation" headerActions={[]}>
      {plug ? (
        <PageExist />
      ) : (
        <>
          <Space style={{ display: "flex", justifyContent: "center" }}>
            <Avatar size={80} src={<img src={avatarPage} alt="Евгений" />} />
          </Space>
          <Title className="site-page-title" level={4}>
            {nameUser}
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
              {bankName && <Text strong>{bankName}</Text>}
              {cardNumber && (
                <Paragraph copyable>
                  <CreditCardOutlined />
                  <Text style={{ fontSize: "150%" }} code>
                    {cardNumber}
                  </Text>
                </Paragraph>
              )}
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
            {socialTelegram || socialWhats || socialLink ? <Text>My contacts</Text> : null}
            {!telegram || socialTelegram ? (
              <Paragraph>
                <Image alt="socialTelegram" src={telegram} height={30} width={30} preview={false} />
                <Link style={{ marginLeft: 5 }} href={socialTelegram} target="_blank">
                  {socialTelegram}
                </Link>
              </Paragraph>
            ) : null}
            {!whats || socialWhats ? (
              <Paragraph>
                <Image alt="socialWhats" src={whats} height={30} width={30} preview={false} />
                <Link style={{ marginLeft: 5 }} href={`tel:${socialWhats}`} target="_blank">
                  {socialWhats}
                </Link>
              </Paragraph>
            ) : null}
            {!email || socialLink ? (
              <Paragraph>
                <Image alt="socialLink" src={email} height={30} width={30} preview={false} />
                <Link style={{ marginLeft: 5 }} href={`mailto:${socialLink}`} target="_blank">
                  {socialLink}
                </Link>
              </Paragraph>
            ) : null}
            <Text>Donation leave here</Text>
          </Space>
          {pageId && (
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
          )}
          <Divider dashed />
        </>
      )}
    </BaseLayout>
  );
};
