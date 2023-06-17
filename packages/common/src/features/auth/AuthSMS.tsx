import React, { useEffect, useState } from "react";
import { Form, Button, Typography, Card, Space, Input, Tooltip, Alert, notification } from "antd";
import { routes } from "../../../../tracker/src/shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { Reactphone } from "../auth-phone/Reactphone";
import "../../../../tracker/src/App.less";
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import { MobileTwoTone } from "@ant-design/icons";

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
          if (error.code === "auth/invalid-verification-code") {
            notification.error({
              message: "Ошибка аутентификации",
              description: "Неверный код аутентификации. Введите правильный код.",
            });
          }
        });
    }
  };

  return (
    <Space direction="vertical" size="middle" align="center" style={{ display: "flex" }}>
      <Space>
        <Alert
          message="Внимание!"
          description="Если у вы уже регистрировали аккаунт через почту или Google, то при входе по номеру телефона создастся новый аккаунт."
          type="warning"
          showIcon
          closable
        />
      </Space>
      <Card>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          onFinish={requstOTP}
        >
          <div style={{ marginBottom: "16px" }}>
            <Reactphone value={value} setValue={setValue} />
            {expandForm && (
              <Input
                style={{ marginTop: "32px" }}
                className="phone-input"
                value={OTP}
                onChange={verifyOTP}
                placeholder="введите 6-ти значный SMS код"
                maxLength={6}
              />
            )}
          </div>
          {!expandForm && (
            <div style={{ marginTop: "16px", marginLeft: "16px" }}>
              <Button type="dashed" size="middle" htmlType="submit">
                ПОЛУЧИТЬ SMS КОД <MobileTwoTone />
              </Button>
            </div>
          )}
          {expandForm && (
            <div style={{ marginTop: "16px", marginLeft: "16px" }}>
              <Alert message="Код отправлен" type="success" showIcon></Alert>
            </div>
          )}
          <div id="recaptcha-container"></div>
        </Form>
      </Card>
    </Space>
  );
};
