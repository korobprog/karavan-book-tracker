import { Button, Divider, Typography } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { routes } from "../shared/routes";

import { MessageOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

export const ContactUs = () => {
  const { Title, Text, Paragraph } = Typography;
  const { t } = useTranslation();

  return (
    <BaseLayout title={t("contact.title")} headerActions={[]} backPath={routes.root}>
      <Title className="site-page-title" level={4}>
        {t("contact.write_to_us")}
      </Title>
      <Paragraph>
        {t("contact.write_to_us_with_bot")} <Text strong>{t("contact.book_tracker_support")}</Text>{" "}
        {t("contact.bot_dasa")}:
      </Paragraph>
      <Text></Text>
      <Paragraph>
        <ul>
          <li>{t("contact.technical_support")}</li>
          <li>{t("contact.send_story")}</li>
          <li>{t("contact.app_instructions")}</li>
        </ul>
      </Paragraph>
      <Divider dashed />
      <Button
        href="https://t.me/karavanBook_bot"
        target="_blank"
        block
        size="large"
        icon={<MessageOutlined />}
        type="dashed"
      >
        {t("contact.support")}
      </Button>
      <Divider dashed />
      <Text italic>{t("contact.book_tracker_developers")}</Text>
    </BaseLayout>
  );
};
