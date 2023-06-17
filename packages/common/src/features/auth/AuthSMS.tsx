import React, { useEffect, useState } from "react";
import { Form, Button, Typography, Card, Space, Input } from "antd";
import { routes } from "../../../../tracker/src/shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { Reactphone } from "../auth-phone/Reactphone";
import "../../../../tracker/src/App.less";
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from "firebase/auth";

type Props = {
  currentUser: CurrentUser;
};

export const AuthSMS = ({ currentUser }: Props) => {
  const { auth, user } = currentUser;
  const [value, setValue] = useState("");
  const [expandForm, setExpandForm] = useState(false);
  const [OTP, setOTP] = useState("");
  const [confirmationResult, setСonfirmationResult] = useState<ConfirmationResult>();

  let PhoneNumber = value;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(routes.root);
    }
  }, [navigate, user]);

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const { Title } = Typography;

  const requstOTP = () => {
    console.log(PhoneNumber);
    if (PhoneNumber.length >= 12) {
      setExpandForm(true);
      const appVerifier = new RecaptchaVerifier("recaptcha-container", { size: "invisible" }, auth);
      if (appVerifier) {
        signInWithPhoneNumber(auth, PhoneNumber, appVerifier)
          .then((confirmationResult) => {
            // Отправлено SMS. Предложите пользователю ввести код из сообщения, затем войдите в систему
            // пользователя с результатом подтверждения.подтвердите (код).
            console.log(confirmationResult);
            setСonfirmationResult(confirmationResult);
          })
          .catch(function (error) {
            // Error; SMS not sent
            console.log(error);
          });
      }
    }
  };

  const verifyOTP: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const otp = event.target.value;
    setOTP(otp);
    if (otp.length === 6) {
      // Результат подтверждения
      //успех код вер.
      confirmationResult
        ?.confirm(otp)
        .then((confirmationResult) => {
          console.log("🚀 ~ success:", confirmationResult);
        })
        .catch((error) => {
          // User couldn't sign in (bad verification code?)
          console.log(error);
        });
    }
  };

  return (
    <Space direction="vertical" size="middle" align="center" style={{ display: "flex" }}>
      <Card>
        <Title className="site-page-title" level={5}>
          Введите номер телефона
        </Title>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          onFinish={requstOTP}
        >
          <Reactphone value={value} setValue={setValue} />
          {expandForm && <Input className="phone-input" value={OTP} onChange={verifyOTP} />}
          {!expandForm && (
            <div style={{ marginTop: "16px" }}>
              <Button type="dashed" size="middle" htmlType="submit">
                ПОЛУЧИТЬ SMS КОД
              </Button>
            </div>
          )}

          <div id="recaptcha-container"></div>
        </Form>
      </Card>
    </Space>
  );
};
