import { useState } from "react";
import {
  Button,
  Form,
  Input,
  Space,
  Tooltip,
  Image,
  Divider,
  Switch,
  Typography,
  Alert,
} from "antd";
import { MinusCircleOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DonationPageDoc } from "common/src/services/api/donation";
import { InfoCircleOutlined } from "@ant-design/icons";
import telegram from "common/src/images/telegram.svg";
import whats from "common/src/images/whatsapp.svg";
import email from "common/src/images/email.svg";
import link from "common/src/images/link_b.svg";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useTranslation } from "react-i18next";

export type PageFormValues = DonationPageDoc;

type Props = {
  onFinish: (formValues: PageFormValues) => Promise<void>;
  initialValues: PageFormValues;
  disabled?: boolean;
  currentUser: CurrentUser;
};

export const PageForm = (props: Props) => {
  const { onFinish, initialValues, disabled } = props;
  const { t } = useTranslation();

  const [switchState, setSwitchState] = useState(initialValues.active);

  const handleSwitchChange = (checked: boolean | ((prevState: boolean) => boolean)) => {
    setSwitchState(checked);
  };

  const { Text } = Typography;
  const { TextArea } = Input;

  const title = {
    titleBank: t("donation.form.titleBank"),
    titleCard: t("donation.form.titleCard"),
    titleQr: t("donation.form.titleQr"),
    titleButton: t("donation.form.titleButton"),
  };

  return (
    <Form
      name="pageDonationForm"
      onFinish={onFinish}
      autoComplete="off"
      initialValues={initialValues}
      layout="vertical"
    >
      <Space style={{ display: "flex", flexFlow: "column", alignItems: "center" }}>
        <Form.Item name={"active"}>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            checked={switchState}
            onChange={handleSwitchChange}
          />
        </Form.Item>
      </Space>
      <Space direction="vertical" style={{ marginTop: 15, display: "flex", alignItems: "center" }}>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("common.save")}
          </Button>
        </Form.Item>
      </Space>
      <Space
        direction="horizontal"
        style={{
          display: "flex",
          marginBottom: 15,
          flexFlow: "column",
          alignItems: "center",
          marginTop: 25,
        }}
      >
        <Alert
          message={t("donation.form.setup_message_title")}
          description={t("donation.form.setup_message_description")}
          type="info"
          showIcon
        />
      </Space>
      <Form.Item name={"greetingText"} label={t("donation.form.greeting_text_label")}>
        <TextArea
          showCount
          maxLength={200}
          placeholder={t("donation.form.greeting_text_placeholder")}
          style={{ height: 120, resize: "none" }}
        />
      </Form.Item>

      <Form.List name="banks">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key}>
                <Tooltip
                  trigger={["focus"]}
                  placement="top"
                  overlayClassName="numeric-input"
                  title={title.titleBank}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "bankName"]}
                    rules={[{ required: true, message: t("donation.form.bank_name_required") }]}
                    label={t("donation.form.bank_label")}
                  >
                    <Input disabled={disabled} placeholder={t("donation.form.bank_placeholder")} />
                  </Form.Item>
                </Tooltip>
                <Tooltip
                  trigger={["focus"]}
                  placement="top"
                  overlayClassName="numeric-input"
                  title={title.titleCard}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "cardNumber"]}
                    rules={[
                      {
                        required: false,
                      },
                    ]}
                    label={t("donation.form.card_number_label")}
                  >
                    <Input
                      disabled={disabled}
                      placeholder={t("donation.form.card_number_placeholder")}
                    />
                  </Form.Item>
                </Tooltip>
                <Tooltip
                  trigger={["focus"]}
                  placement="top"
                  overlayClassName="numeric-input"
                  title={title.titleQr}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "qrLink"]}
                    initialValue=""
                    label={t("donation.form.qr_link_label")}
                  >
                    <Input
                      suffix={
                        <Tooltip title={t("donation.form.qr_link_suffix_title")}>
                          <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                        </Tooltip>
                      }
                      disabled={disabled}
                      placeholder={t("donation.form.qr_link_placeholder")}
                    />
                  </Form.Item>
                </Tooltip>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                disabled={disabled}
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                style={{ width: "95%" }}
              >
                {t("donation.form.add_bank_details_button")}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Tooltip
        trigger={["focus"]}
        placement="topLeft"
        overlayClassName="numeric-input"
        title={title.titleButton}
      >
        <Form.Item name="buttonBank" label={t("donation.form.button_label")}>
          <Input
            disabled={disabled}
            placeholder={t("donation.form.button_placeholder")}
            style={{ width: "60%" }}
            maxLength={25}
          />
        </Form.Item>
      </Tooltip>
      <Divider dashed />
      <Space direction="vertical" style={{ marginTop: 15, display: "flex", alignItems: "center" }}>
        <Text italic>{t("donation.form.contact_info_message")}</Text>
        <Space style={{ marginTop: 15 }}>
          <Image
            style={{ position: "absolute", top: -10, left: 5 }}
            alt="telegram"
            src={telegram}
            height={30}
            width={30}
            preview={false}
          />
          <Form.Item name="socialTelegram">
            <Input
              addonBefore="https://t.me/"
              disabled={disabled}
              placeholder={t("donation.form.telegram_placeholder")}
              suffix={
                <Tooltip title={t("donation.form.telegram_suffix_title")}>
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>
        </Space>
        <Space>
          <Image
            style={{ position: "absolute", top: -10, left: 5 }}
            alt="whats"
            src={whats}
            height={30}
            width={30}
            preview={false}
          />
          <Form.Item name="socialWhats">
            <Input
              disabled={disabled}
              placeholder={t("donation.form.whats_placeholder")}
              suffix={
                <Tooltip title={t("donation.form.whats_suffix_title")}>
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>
        </Space>
        <Space>
          <Image
            style={{ position: "absolute", top: -10, left: 5 }}
            alt="email"
            src={email}
            height={30}
            width={30}
            preview={false}
          />
          <Form.Item name="socialMail">
            <Input
              disabled={disabled}
              placeholder={t("donation.form.email_placeholder")}
              suffix={
                <Tooltip title={t("donation.form.email_suffix_title")}>
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>
        </Space>
        <Space>
          <Image
            style={{ position: "absolute", top: -10, left: 5 }}
            alt="link"
            src={link}
            height={30}
            width={30}
            preview={false}
          />
          <Form.Item name="socialLink">
            <Input
              disabled={disabled}
              placeholder={t("donation.form.other_links_placeholder")}
              suffix={
                <Tooltip title={t("donation.form.other_links_suffix_title")}>
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>
        </Space>
      </Space>
      <Divider dashed />
      <Space direction="vertical" style={{ marginTop: 15, display: "flex", alignItems: "center" }}>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("common.save")}
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
};
