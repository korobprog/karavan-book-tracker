import { Button, notification } from 'antd';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { routes } from "../shared/routes";


const passwordRecovery = {
    // Внутри компонента:
const auth = getAuth();

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
