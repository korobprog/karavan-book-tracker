import { Button, Divider, Typography } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { routes } from "../shared/routes";
import Link from "antd/es/typography/Link";
import { MessageOutlined } from "@ant-design/icons";

export const ContactUs = () => {
  const { Title, Text, Paragraph } = Typography;
  return (
    <BaseLayout title="Связаться с нами" headerActions={[]} backPath={routes.root}>
      <Title className="site-page-title" level={4}>
        Напишите нам
      </Title>
      <Paragraph>
        Напишите нам с помощью нашего <Text strong>BookTrackerSupport</Text> бота{" "}
        <Text strong>Даси</Text> в телеграм:
      </Paragraph>
      <Text></Text>
      <Paragraph>
        <ul>
          <li>Техничесская поддержка</li>
          <li>Отправить историю</li>
          <li>Инструкция приложения</li>
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
        поддержка
      </Button>
      <Divider dashed />
      <Text italic>Разработчики BookTracker - Коробков Максим и Вадим Токарь</Text>
    </BaseLayout>
  );
};
