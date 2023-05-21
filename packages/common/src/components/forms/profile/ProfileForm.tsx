import React, { useState } from "react";
import { Button, Typography, Form, Input } from "antd";
import { UserDoc } from "common/src/services/api/useUser";
import { phoneNumberPattern } from "common/src/utils/patterns";
import { SelectLocation } from "common/src/features/select-location/SelectLocation";
import { removeEmptyFields } from "../../../utils/objects";
import { AvatarUploader } from "./AvatarUploader ";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export type ProfileFormValues = UserDoc;

type Props = {
  onFinish: (newProfile: UserDoc) => Promise<void>;
  initialValues?: ProfileFormValues;
  isLoading?: boolean;
  isEmailEditable?: boolean;
  userId: string;
};

export const ProfileForm = (props: Props) => {
  const { userId, onFinish, initialValues, isLoading, isEmailEditable } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialValues?.avatar);

  const onFinishHandler = ({ ...formValues }: UserDoc) => {
    setIsSubmitting(true);
    onFinish(removeEmptyFields({...formValues, avatar: imageUrl })).finally(() => setIsSubmitting(false));
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
      <Typography.Paragraph>Обязательно заполните профиль</Typography.Paragraph>
      <Form.Item name="avatar" label="Avatar" valuePropName="avatar">
        <AvatarUploader imageUrl={imageUrl} onImageUrlChange={setImageUrl} userId={userId} />
      </Form.Item>
      <Form.Item name="name" label="Ваше Ф.И.О" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="nameSpiritual" label="Ваше духовное имя" rules={[{ required: false }]}>
        <Input />
      </Form.Item>
      <Form.Item name="city" label="Ваш город" rules={[{ required: true }]}>
        <SelectLocation />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Ваш телефон"
        rules={[
          { required: true, message: "Пожалуйста, введите свой номер телефона!" },
          { pattern: phoneNumberPattern, message: "Пожалуйста, введите корректный номер" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="email"
        rules={
          isEmailEditable ? [{ required: true, message: "Пожалуйста, введите email" }] : undefined
        }
      >
        <Input disabled={!isEmailEditable} />
      </Form.Item>
      <Form.Item name="address" label="Ваш адрес" rules={[{ required: false }]}>
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit" loading={isSubmitting || isLoading}>
          СОХРАНИТЬ
        </Button>
      </Form.Item>
    </Form>
  );
};
