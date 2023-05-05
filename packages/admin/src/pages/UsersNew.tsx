import { useState } from "react";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { BaseLayout } from "common/src/components/BaseLayout";
import { SelectLocation } from "common/src/features/select-location/SelectLocation";

type Props = {
  currentUser: CurrentUser;
};

export const UsersNew = ({ currentUser }: Props) => {
  const { addNewUnattachedProfile } = useUser({ profile: currentUser.profile });
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onFinish = ({ phone, prefix, ...formValues }: any) => {
    setIsSubmitting(true);
    addNewUnattachedProfile({
      ...formValues,
      phone,
    })
      .then(() => navigate(routes.users))
      .finally(() => setIsSubmitting(false));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <BaseLayout title="СОЗДАНИЕ НОВОГО ПОЛЬЗОВАТЕЛЯ" backPath={routes.users}>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        {...layout}
      >
        <Form.Item
          name="name"
          label="Ф.И.О"
          rules={[{ required: true }]}
          initialValue={""}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="nameSpiritual"
          label="Духовное имя"
          rules={[{ required: false }]}
          initialValue={""}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="city"
          label="Город"
          rules={[{ required: true }]}
          initialValue={""}
        >
          <SelectLocation />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Телефон"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите номер телефона!",
            },
          ]}
          initialValue={""}
        >
          <Input style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="email"
          label="email"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите email",
            },
          ]}
          initialValue={""}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Адрес"
          rules={[{ required: false }]}
          initialValue={""}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            ДОБАВИТЬ
          </Button>
        </Form.Item>
      </Form>
    </BaseLayout>
  );
};
