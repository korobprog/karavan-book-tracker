import { MailFilled } from '@ant-design/icons';
import { Button, Form, Input, notification } from 'antd';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


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

    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const onFinish = (values: any) => {
      sendPasswordResetEmail(auth, email)
        .then(() => {

          // Тут при успехе покажем нотификацию
          notification.open({
            message: 'Письмо отправлено',
            description: `Зайдите на почту ${email} и пройдите по ссылке, чтобы восстановить пароль `,
          });
          return (
            <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
              <Form.Item name={['email']} label="Email" rules={[{ type: 'email' }]}>
                <Input />
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                  восстановить пароль
                </Button>
              </Form.Item>
            </Form>
          );
        }
  }
}