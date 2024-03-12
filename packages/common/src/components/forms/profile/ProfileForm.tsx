import React, { useState } from "react";
import { Button, Typography, Form, Input } from "antd";
import { UserDoc } from "common/src/services/api/useUser";
import { phoneNumberPattern } from "common/src/utils/patterns";
import { SelectLocation } from "common/src/features/select-location/SelectLocation";
import { removeEmptyFields } from "../../../utils/objects";
import { AvatarUploader } from "./AvatarUploader ";
import { getViewTransitionStyles } from "../../../utils/transition";
import { useTranslation } from "react-i18next";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export type ProfileFormValues = UserDoc;

type Props<FormValues> = {
  onFinish: (formValues: FormValues) => Promise<void>;
  initialValues?: FormValues;
  isLoading?: boolean;
  isEmailEditable?: boolean;
  userId: string;
  isYatraLocationRequired?: boolean;
  slot?: React.ReactNode;
};

export const ProfileForm = <FormValues extends ProfileFormValues>(props: Props<FormValues>) => {
  const {
    userId,
    onFinish,
    initialValues,
    isLoading,
    isEmailEditable,
    slot,
    isYatraLocationRequired,
  } = props;
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialValues?.avatar);

  const onFinishHandler = ({ ...formValues }: UserDoc) => {
    setIsSubmitting(true);
    onFinish(removeEmptyFields({ ...formValues, avatar: imageUrl })).finally(() =>
      setIsSubmitting(false)
    );
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      initialValues={initialValues}
      onFinish={onFinishHandler}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      {...layout}
    >
      <Typography.Paragraph>{t("profile.form.fill_profile")}</Typography.Paragraph>
      {userId !== "none" && (
        <Form.Item name="avatar" label={t("profile.form.avatar_label")} valuePropName="avatar">
          <AvatarUploader
            imageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
            userId={userId}
            imgStyle={getViewTransitionStyles("avatar")}
          />
        </Form.Item>
      )}
      <Form.Item name="name" label={t("profile.form.full_name_label")} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="nameSpiritual"
        label={t("profile.form.spiritual_name_label")}
        rules={[{ required: false }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="city" label={t("profile.form.city_label")} rules={[{ required: true }]}>
        <SelectLocation name="city" />
      </Form.Item>
      <Form.Item
        name="yatraLocationId"
        label={t("profile.form.yatra_label")}
        rules={[{ required: isYatraLocationRequired }]}
      >
        <SelectLocation name="yatraLocationId" />
      </Form.Item>
      <Form.Item
        name="phone"
        label={t("profile.form.phone_label")}
        rules={[
          { required: true, message: t("profile.form.phone_required_message") },
          { pattern: phoneNumberPattern, message: t("profile.form.phone_pattern_message") },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label={t("profile.form.email")}
        rules={
          isEmailEditable
            ? [{ required: true, message: t("profile.form.email_required_message") }]
            : undefined
        }
      >
        <Input disabled={!isEmailEditable} />
      </Form.Item>
      <Form.Item
        name="address"
        label={t("profile.form.address_label")}
        rules={[{ required: false }]}
      >
        <Input />
      </Form.Item>

      {slot}

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit" loading={isSubmitting || isLoading}>
          {t("common.save")}
        </Button>
      </Form.Item>
    </Form>
  );
};
