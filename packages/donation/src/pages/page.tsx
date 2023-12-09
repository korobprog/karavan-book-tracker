import React from "react";
import { Divider, QRCode, Typography, Image, Avatar, Button, Space } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { BankTwoTone, CreditCardOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { Page404 } from "./404";
import { DonationPageDoc } from "common/src/services/api/donation";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { apiRefs } from "common/src/services/api/refs";
import telegram from "common/src/images/telegram.svg";
import whats from "common/src/images/whatsapp.svg";
import email from "common/src/images/email.svg";
import link from "common/src/images/link_b.svg";
import logo from "common/src/images/logo.png";

export const Page = () => {
  const initialPageDoc: DonationPageDoc = {
    banks: [],
    active: false,
    socialTelegram: "",
    socialWhats: "",
    socialLink: "",
    socialMail: "",
    avatar: "",
    userName: "",
    greetingText: "",
  };

  const { pageId } = useParams<{ pageId: string }>();

  const [donationPageDocData, donationPageDocLoading] = useDocumentData<DonationPageDoc>(
    pageId ? apiRefs.donationPage(pageId) : null
  );
  const initialValues = donationPageDocData || initialPageDoc;

  const {
    socialTelegram,
    socialWhats,
    socialLink,
    avatar,
    userName,
    greetingText,
    socialMail,
    buttonBank,
  } = initialValues;
  console.log("🚀 ~ file: page.tsx:46 ~ Page ~ socialTelegram:", socialTelegram);

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

  const textButton = "OnlinePay";

  if (donationPageDocLoading) {
    return (
      <BaseLayout title="Book Donation" headerActions={[]}>
        loading...
      </BaseLayout>
    );
  }

  return (
    <BaseLayout title="Book Donation" headerActions={[]}>
      {plug ? (
        <Page404 />
      ) : (
        <>
          <Space style={{ display: "flex", justifyContent: "center" }}>
            <Avatar size={80} src={<img src={avatar || logo} alt={userName} />} />
          </Space>
          <Title className="site-page-title" level={4}>
            {userName}
          </Title>
          <Paragraph>
            {greetingText ? (
              <pre>{greetingText}</pre>
            ) : (
              <pre>Вы можете пожертвовать на печать и выкуп книг</pre>
            )}
          </Paragraph>
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
                <Paragraph>
                  <CreditCardOutlined />
                  <Text copyable={{ tooltips: false }} style={{ fontSize: "150%" }} code>
                    {cardNumber}
                  </Text>
                </Paragraph>
              )}
              {qrLink && (
                <>
                  {buttonBank ? (
                    <Button href={qrLink} icon={<BankTwoTone />}>
                      {buttonBank} {bankName}
                    </Button>
                  ) : (
                    <Button href={qrLink} icon={<BankTwoTone />}>
                      {textButton} {bankName}
                    </Button>
                  )}
                  <QRCode
                    className="centred"
                    value={qrLink}
                    bgColor="#fff"
                    style={{ marginBottom: 16 }}
                  />
                </>
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
            {socialTelegram || socialWhats || socialMail || socialLink ? (
              <Text>My contacts</Text>
            ) : null}
            {!telegram || socialTelegram ? (
              <Paragraph>
                <Image alt="socialTelegram" src={telegram} height={30} width={30} preview={false} />
                <Link
                  style={{ marginLeft: 5 }}
                  href={`https://t.me/${socialTelegram}`}
                  target="_blank"
                >
                  {`@${socialTelegram}`}
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
            {!email || socialMail ? (
              <Paragraph>
                <Image alt="socialLink" src={email} height={30} width={30} preview={false} />
                <Link style={{ marginLeft: 5 }} href={`mailto:${socialMail}`} target="_blank">
                  {socialMail}
                </Link>
              </Paragraph>
            ) : null}
            {!link || socialLink ? (
              <Paragraph>
                <Image alt="socialLink" src={link} height={30} width={30} preview={false} />
                <Link style={{ marginLeft: 5 }} href={socialLink} target="_blank">
                  {socialLink}
                </Link>
              </Paragraph>
            ) : null}
            <Text>Leave donation here</Text>
          </Space>
          {pageId && (
            <div id="myqrcode">
              <QRCode
                className="centred"
                value={window.location.href}
                bgColor="#fff"
                style={{ marginBottom: 16 }}
              />
            </div>
          )}
          <Divider dashed />
        </>
      )}
    </BaseLayout>
  );
};
