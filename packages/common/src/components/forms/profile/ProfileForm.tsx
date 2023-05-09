import React, { useState } from "react";
import { Button, Typography, Form, Input } from "antd";
import { UserDoc } from "common/src/services/api/useUser";
import { phoneNumberPattern } from "common/src/utils/patterns";
import { SelectLocation } from "common/src/features/select-location/SelectLocation";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export type ProfileFormValues = UserDoc;

type Props = {
  onFinish: (newProfile: UserDoc) => Promise<void>;
  initialValues?: ProfileFormValues;
  isLoading?: boolean;
};

export const ProfileForm = (props: Props) => {
  const { onFinish, initialValues, isLoading } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { Paragraph } = Typography;

  const onFinishHandler = ({ ...formValues }: UserDoc) => {
    setIsSubmitting(true);
    onFinish(formValues).finally(() => setIsSubmitting(false));
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
      <Paragraph>Обязательно заполните Ваш профиль</Paragraph>

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
      <Form.Item name="email" label="Ваш email">
        <Input disabled />
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
