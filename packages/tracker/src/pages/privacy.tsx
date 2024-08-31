import { Typography } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { routes } from "../shared/routes";
import Link from "antd/es/typography/Link";
import { useTranslation } from "react-i18next";

export const Privacy = () => {
  const { Title, Paragraph } = Typography;
  const { t } = useTranslation();

  return (
    <BaseLayout title="Регистрация" headerActions={[]} backPath={routes.registration}>
      <Title className="site-page-title" level={2}>
        {t("privacy.title")}
      </Title>
      <Title className="site-page-title" level={3}>
        {t("privacy.conditions.title")}
      </Title>
      <Paragraph>{t("privacy.conditions.text")}</Paragraph>
      <Paragraph>
        <ul>
          <li>
            <Link href="https://policies.google.com/terms">
              {t("privacy.conditions.google_play")}
            </Link>
          </li>
          <li>
            <Link href="https://www.google.com/analytics/terms/">
              {t("privacy.conditions.google_analytics")}
            </Link>
          </li>
        </ul>
      </Paragraph>
      <Paragraph>{t("privacy.conditions.addition")}</Paragraph>
      <Title className="site-page-title" level={3}>
        {t("privacy.changes.title")}
      </Title>
      <Paragraph>{t("privacy.changes.text")}</Paragraph>
      <Title className="site-page-title" level={3}>
        {t("privacy.contact.title")}
      </Title>
      <Paragraph>{t("privacy.contact.text")}</Paragraph>

      <Title className="site-page-title" level={3}>
        {t("privacy.information.title")}
      </Title>
      <Paragraph>{t("privacy.information.text")}</Paragraph>
      <Paragraph>
        <ul>
          <li>
            <Link href="https://policies.google.com/terms">
              {t("privacy.conditions.google_play")}
            </Link>
          </li>
          <li>
            <Link href="https://www.google.com/analytics/terms/">
              {t("privacy.conditions.google_analytics")}
            </Link>
          </li>
        </ul>
      </Paragraph>
      <Title className="site-page-title" level={3}>
        {t("privacy.data.title")}
      </Title>
      <Paragraph>{t("privacy.data.text")}</Paragraph>
      <Title className="site-page-title" level={3}>
        {t("privacy.cookie.title")}
      </Title>
      <Paragraph>{t("privacy.cookie.text")}</Paragraph>
      <Title className="site-page-title" level={3}>
        {t("privacy.providers.title")}
      </Title>
      <Paragraph>
        {t("privacy.providers.list")}
        <ul>
          <li> {t("privacy.providers.item-0")}</li>
          <li> {t("privacy.providers.item-1")}</li>
          <li>{t("privacy.providers.item-2")}</li>
          <li>{t("privacy.providers.item-3")}</li>
        </ul>
        {t("privacy.providers.text")}
      </Paragraph>
      <Title className="site-page-title" level={3}>
        {t("privacy.safety.title")}
      </Title>
      <Paragraph>{t("privacy.safety.text")}</Paragraph>
      <Title className="site-page-title" level={3}>
        {t("privacy.links.title")}
      </Title>
      <Paragraph>{t("privacy.links.text")}</Paragraph>
      <Title className="site-page-title" level={3}>
        {t("privacy.children.title")}
      </Title>
      <Paragraph>{t("privacy.children.text")}</Paragraph>
      <Title className="site-page-title" level={3}>
        {t("privacy.policyChanges.title")}
      </Title>
      <Paragraph>{t("privacy.policyChanges.text")}</Paragraph>
      <Title className="site-page-title" level={3}>
        {t("privacy.policyChanges.contact")}
      </Title>
      <Paragraph>{t("privacy.policyChanges.contact_text")}</Paragraph>
    </BaseLayout>
  );
};
