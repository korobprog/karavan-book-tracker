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

export const Page = () => {
  const initialPageDoc: DonationPageDoc = {
    banks: [],
    active: false,
    socialTelegram: "",
    socialWhats: "",
    socialLink: "",
    avatar: "",
    userName: "",
  };

  const { pageId } = useParams<{ pageId: string }>();

  const [donationPageDocData, donationPageDocLoading] = useDocumentData<DonationPageDoc>(
    pageId ? apiRefs.donationPage(pageId) : null
  );
  const initialValues = donationPageDocData || initialPageDoc;

  const { socialTelegram, socialWhats, socialLink, avatar, userName } = initialValues;

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
            <Avatar size={80} src={<img src={avatar} alt={userName} />} />
          </Space>
          <Title className="site-page-title" level={4}>
            Получатель: {userName}
          </Title>
          <Paragraph>
            <pre>Вы можете перевести средства удобным для Вас способом по следующим реквезитам</pre>
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
                  <Button href={qrLink} icon={<BankTwoTone />}>
                    перевод в один клик онлайн банк {bankName}
                  </Button>
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
