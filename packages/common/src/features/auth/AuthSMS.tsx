import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Typography,
  Card,
  Space,
  InputNumber,
} from "antd";
import { routes } from "../../../../tracker/src/shared/routes";
import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { Reactphone } from "../auth-phone/Reactphone"
import '../../../../tracker/src/App.less'
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult, getAuth } from "firebase/auth";

type Props = {
  currentUser: CurrentUser;
};

export const AuthSMS = ({ currentUser }: Props) => {
  const { auth, user } = currentUser;
  //const { setProfile } = useUser({ profile, user });
  const [value, setValue] = useState('')
  const [expandForm, setExpanForm] = useState(false);
  const [OTP, setOTP] = useState('');
  const [confirmationResult, setСonfirmationResult] = useState<ConfirmationResult>();
  const [recaptchaVerifier, setrecaptcha] = useState<RecaptchaVerifier>();

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
  // phone number state
  //const [PhoneNumber, setPhoneNumper] = useState(countryCode);
  const generateRecaptcha = () => {
    setrecaptcha(new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
    }, auth));
  }

  const requstOTP = (e:any) => {
    e.prevenDefault();
    if (PhoneNumber.length >= 12) {
      setExpanForm(true);
      generateRecaptcha();
      let appVerifier = recaptchaVerifier;
      if (appVerifier) {
        // под вопросом getAuth
        const auth = getAuth();
        signInWithPhoneNumber(auth, PhoneNumber, appVerifier)
          .then(confirmationResult => {
            // Отправлено SMS. Предложите пользователю ввести код из сообщения, затем войдите в систему
            // пользователя с результатом подтверждения.подтвердите (код).
            confirmationResult.verificationId
            console.log(confirmationResult)
            setСonfirmationResult(confirmationResult)
          }).catch(function (error) {
            // Error; SMS not sent
            console.log(error);
          });
      }
    }
  }

  const verifyOTP = (e:any) => {
    let otp = e.target.value;
    setOTP(otp);
    console.log(otp)
    if (otp.length === 6) { 
      // Результат подтверждения
      //успех код вер.
      confirmationResult?.confirm(otp)
        .then((confirmationResult) => {
          // User signed in successfully.
          confirmationResult.user;
          console.log(otp)
          // ...
        }).catch((error) => {
          // User couldn't sign in (bad verification code?)
          console.log(error);
        });
    }
  }

  return (
    <Space direction="vertical" size="middle" align="center" style={{ display: 'flex' }}>
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
          <Reactphone
            value={value}
            setValue={setValue}
          />
          {expandForm === true ?
            <>
              <InputNumber className="phone-input" value={OTP} onChange={verifyOTP}   />
            </>
            :
            null
          }
          {
            expandForm === false ?
              <Button type="dashed"  size="middle">
                ПОЛУЧИТЬ SMS КОД
              </Button>
              :
              null
          }
          <div id="recaptcha-container"></div>
        </Form>
      </Card>
    </Space>
  );
};
