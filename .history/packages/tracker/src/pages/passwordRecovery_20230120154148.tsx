import { MailFilled } from '@ant-design/icons';
import { Button, Form, Input, notification } from 'antd';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { routes } from "../shared/routes";


const passwordRecovery = {
    // Внутри компонента:
const auth = getAuth();
const resetPasswordFunction = () => {
  const email = MailFilled.values; 
// остальное внутри onFinish:
sendPasswordResetEmail(auth, email)
  .then(() => {

    // Тут при успехе покажем нотификацию
notification.open({
    message: 'Письмо отправлено',
    description: `Зайдите на почту ${email} и пройдите по ссылке, чтобы восстановить пароль `,
  });

  })
  .catch((error) => {
    // Обработка ошибок
    const errorCode = error.code;
    const errorMessage = error.message;

  });
}

}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
  },
};
/* eslint-enable no-template-curly-in-string */

const onFinish = (values: any) => {
    console.log(values);


  return (
    <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
      <Form.Item name={['email']} label="Email" rules={[{ type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
