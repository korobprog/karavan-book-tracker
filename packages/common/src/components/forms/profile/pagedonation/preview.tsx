import { DonationPageDoc } from "common/src/services/api/donation";
import { useParams } from "react-router-dom";
import telegram from "common/src/images/telegram.svg";
import whats from "common/src/images/whatsapp.svg";
import email from "common/src/images/email.svg";
import link from "common/src/images/link_b.svg";
import logo from "common/src/images/logo.png";
import { Divider, QRCode, Typography, Image, Avatar, Button, Space } from "antd";
import { CurrentUser } from "../../../../services/api/useCurrentUser";
import { BankTwoTone, CreditCardOutlined } from "@ant-design/icons";
import React from "react";

type Props = {
  onFinish: (formValues: PageFormValues) => Promise<void>;
  initialValues: PageFormValues;
  disabled?: boolean;
  currentUser: CurrentUser;
};
export type PageFormValues = DonationPageDoc;
export const Preview = (props: Props) => {
  const initialPageDoc: DonationPageDoc = {
    banks: [],
    active: false,
    socialTelegram: "",
    socialWhats: "",
    socialMail: "",
    socialLink: "",
    avatar: "",
    userName: "",
    greetingText: "",
    buttonBank: "",
  };

  const { initialValues } = props;

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
  console.log("🚀 ~ file: preview.tsx:36 ~ Preview ~ initialValues:", initialValues);

  const { Paragraph, Text, Link, Title } = Typography;
  const textButton = "OnlinePay";
  const { pageId } = useParams<{ pageId: string }>();
  return (
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
            <Link style={{ marginLeft: 5 }} href={`https://t.me/${socialTelegram}`} target="_blank">
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
  );
};
