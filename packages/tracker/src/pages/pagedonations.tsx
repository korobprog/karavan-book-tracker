import React from "react";
import { Button, Form, Space, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { useUser } from "common/src/services/api/useUser";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { DonationPageDoc } from "common/src/services/api/donation";

type Props = {
  currentUser: CurrentUser;
};

const PageDonations = ({ currentUser }: Props) => {
  const { profile, user } = currentUser;

  const avatar = profile?.avatar;

  const initialPageDoc: DonationPageDoc = {
    banks: [],
    active: false,
    avatar: "",
  };

  const userId = profile?.id || user?.uid || "";

  const onFinish = async (formValues: DonationPageDoc) => {};

  <Form
    name="dynamic_form_nest_item"
    onFinish={onFinish}
    style={{ maxWidth: 600 }}
    autoComplete="off"
  >
    <Form.List name="users">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
              <Form.Item
                {...restField}
                name={[name, "first"]}
                rules={[{ required: true, message: "Missing first name" }]}
              >
                <Input placeholder="Банк" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "last"]}
                rules={[{ required: true, message: "Missing last name" }]}
              >
                <Input placeholder="Номер карты" />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(name)} />
              <Form.Item
                {...restField}
                name={[name, "last"]}
                rules={[{ required: true, message: "Missing last name" }]}
              >
                <Input placeholder="Ссылка на QR" />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Добавить новые реквезиты
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
    <Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        initialPageDoc={initialPageDoc}
        onFinish={onFinish}
        userId={userId}
      >
        СОХРАНИТЬ
      </Button>
    </Form.Item>
  </Form>;
};

export default PageDonations;
