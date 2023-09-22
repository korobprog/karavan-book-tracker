import { Input, Form, Button } from "antd";

import { CurrentUser } from "common/src/services/api/useCurrentUser";

import { StockDistributorFormValues } from "./helpers";

type FormValues = StockDistributorFormValues;

type Props = {
  currentUser: CurrentUser;
  onFinish: (formValues: FormValues) => void;
  isSubmitting?: boolean;
  initialValues?: FormValues;
};

export const DistributorForm = (props: Props) => {
  const { onFinish, isSubmitting, initialValues: initialValuesProps } = props;

  const initialValues = {
    name: "",
    ...initialValuesProps,
  };

  const [form] = Form.useForm();

  const onFinishHandler = (formValues: FormValues) => {
    onFinish(formValues);
  };

  return (
    <Form name="distributor" onFinish={onFinishHandler} form={form} initialValues={initialValues}>
      <Form.Item name="name" label="Имя распространителя" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          {isSubmitting ? "Сохраняем..." : "Сохранить"}
        </Button>
      </Form.Item>
    </Form>
  );
};
