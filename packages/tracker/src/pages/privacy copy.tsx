import { Typography } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { routes } from "../shared/routes";
import Link from "antd/es/typography/Link";

export const Privacy = () => {
  const { Title, Paragraph } = Typography;
  return (
    <BaseLayout title="Регистрация" headerActions={[]} backPath={routes.registration}>
      <Title className="site-page-title" level={2}>
        Правила и условия
      </Title>
      <Title className="site-page-title" level={3}>
        Условия использования
      </Title>
      <Paragraph>
        При загрузке или использовании приложения к вам автоматически будут применяться настоящие
        условия – поэтому вам следует внимательно ознакомиться с ними перед использованием
        приложения. Вам не разрешается копировать или изменять приложение, любую его часть или наши
        товарные знаки каким-либо образом. Вам не разрешается пытаться извлекать исходный код
        приложения, и вы также не должны пытаться переводить приложение на другие языки или
        создавать производные версии. Само приложение и все торговые марки, авторские права, права
        на базы данных и другие права интеллектуальной собственности, связанные с ним, по-прежнему
        принадлежат Коробкову Максиму. Коробков Максим стремится к тому, чтобы приложение было
        максимально полезным и эффективным. По этой причине мы оставляем за собой право вносить
        изменения в приложение или взимать плату за его услуги в любое время и по любой причине. Мы
        никогда не будем взимать с вас плату за приложение или его услуги, не разъяснив вам, за что
        именно вы платите. Приложение BookTracker хранит и обрабатывает персональные данные, которые
        вы нам предоставили, для предоставления моих услуг. Вы несете ответственность за
        безопасность своего телефона и доступа к приложению. Поэтому мы рекомендуем вам не делать
        джейлбрейк или рутинг вашего телефона, который представляет собой процесс удаления
        программных ограничений, налагаемых официальной операционной системой вашего устройства. Это
        может сделать ваш телефон уязвимым для вредоносных программ, поставить под угрозу функции
        безопасности вашего телефона и может означать, что приложение BookTracker не будет работать
        должным образом или вообще не будет работать. Приложение действительно использует сторонние
        сервисы, которые декларируют свои Условия. Ссылка на Условия сторонних поставщиков услуг,
        используемых приложением
      </Paragraph>
      <Paragraph>
        <ul>
          <li>
            <Link href="https://policies.google.com/terms">Сервисы Google Play</Link>
          </li>
          <li>
            <Link href="https://www.google.com/analytics/terms/">
              Google Analytics для Firebase
            </Link>
          </li>
        </ul>
      </Paragraph>
      <Paragraph>
        Вы должны знать, что есть определенные вещи, за которые Коробков Максим не несет
        ответственности. Для определенных функций приложения потребуется активное подключение к
        Интернету. Подключение может осуществляться по Wi-Fi или предоставляться вашим оператором
        мобильной связи, но Коробков Максим не может нести ответственность за то, что приложение
        работает не в полную силу, если у вас нет доступа к Wi-Fi и у вас не осталось никаких
        данных. Если вы используете приложение за пределами зоны действия Wi-Fi, вам следует
        помнить, что условия соглашения с вашим оператором мобильной связи по-прежнему будут
        действовать. В результате ваш оператор мобильной связи может взимать с вас плату за передачу
        данных в течение всего времени подключения при доступе к приложению или другие сборы
        сторонних производителей. Используя приложение, вы принимаете на себя ответственность за
        любые подобные сборы, включая плату за передачу данных в роуминге, если вы используете
        приложение за пределами своей домашней территории (т.Е. Региона или страны) без отключения
        передачи данных в роуминге. Если вы не являетесь плательщиком счетов за устройство, на
        котором используете приложение, пожалуйста, имейте в виду, что мы предполагаем, что вы
        получили разрешение от плательщика счетов на использование приложения. Точно так же Коробков
        Максим не всегда может нести ответственность за то, как вы используете приложение, т. Е. вам
        необходимо убедиться, что ваше устройство остается заряженным – если у него разрядится
        аккумулятор, и вы не сможете включить его, чтобы воспользоваться Услугой, Коробков Максим не
        может принять на себя ответственность. Что касается ответственности Коробкова Максима за
        использование вами приложения, когда вы используете приложение, важно иметь в виду, что,
        хотя мы стремимся обеспечить его постоянное обновление и корректность, мы полагаемся на
        третьих лиц в предоставлении нам информации, чтобы мы могли сделать ее доступной для вас.
        Коробков Максим не несет никакой ответственности за любые убытки, прямые или косвенные,
        которые вы понесете в результате того, что полностью полагаетесь на эту функциональность
        приложения. В какой-то момент мы, возможно, захотим обновить приложение. В настоящее время
        приложение доступно на Android – требования к системе (и к любым дополнительным системам, на
        которые мы решим продлить доступность приложения) могут измениться, и вам необходимо будет
        загрузить обновления, если вы хотите продолжать использовать приложение. Коробков Максим не
        обещает, что всегда будет обновлять приложение, чтобы оно было актуально для вас и / или
        работало с версией Android, установленной вами на вашем устройстве. Однако вы обещаете
        всегда принимать обновления приложения, когда они вам предлагаются, мы также можем пожелать
        прекратить предоставление приложения и можем прекратить его использование в любое время без
        направления вам уведомления о прекращении. Если мы не сообщим вам иное, при любом
        прекращении действия (а) прекращаются права и лицензии, предоставленные вам в соответствии с
        настоящими условиями; (б) вы должны прекратить использование приложения и (при
        необходимости) удалить его со своего устройства.
      </Paragraph>
      <Title className="site-page-title" level={3}>
        Изменения в Настоящих Правилах и условиях
      </Title>
      <Paragraph>
        Я могу время от времени обновлять наши Условия. Таким образом, вам рекомендуется
        периодически просматривать эту страницу на предмет любых изменений. Я уведомлю вас о любых
        изменениях, разместив новые Условия на этой странице. Настоящие правила и условия вступают в
        силу с 2024-02-19
      </Paragraph>
      <Title className="site-page-title" level={3}>
        Связаться с нами
      </Title>
      <Paragraph>
        Я могу время от времени обновлять наши Условия. Таким образом, вам рекомендуется
        периодически просматривать эту страницу на предмет любых изменений. Я уведомлю вас о любых
        изменениях, разместив новые Условия на этой странице. Настоящие правила и условия вступают в
        силу с 2024-02-19
      </Paragraph>
      <Paragraph>
        Если у вас есть какие-либо вопросы или предложения по поводу моих Условий, не стесняйтесь
        обращаться ко мне по адресу korobprog@gmail.com.
      </Paragraph>

      <Title className="site-page-title" level={3}>
        Сбор и использование информации
      </Title>
      <Paragraph>
        Для улучшения работы при использовании нашего Сервиса я могу потребовать от вас предоставить
        нам определенную личную информацию. Информация, которую я запрашиваю, будет сохранена на
        вашем устройстве и никоим образом мной не собирается. Приложение использует сторонние
        сервисы, которые могут собирать информацию, используемую для вашей идентификации. Ссылка на
        политику конфиденциальности сторонних поставщиков услуг, используемых приложением
      </Paragraph>
      <Paragraph>
        <ul>
          <li>
            <Link href="https://policies.google.com/terms">Сервисы Google Play</Link>
          </li>
          <li>
            <Link href="https://www.google.com/analytics/terms/">
              Google Analytics для Firebase
            </Link>
          </li>
        </ul>
      </Paragraph>
      <Title className="site-page-title" level={3}>
        Данные Журнала
      </Title>
      <Paragraph>
        Я хочу сообщить вам, что всякий раз, когда вы пользуетесь моим Сервисом, в случае ошибки в
        приложении я собираю данные и информацию (через продукты сторонних производителей) на вашем
        телефоне, которые называются Log Data. Эти данные Журнала могут включать такую информацию,
        как адрес интернет-протокола вашего устройства (“IP”), имя устройства, версию операционной
        системы, конфигурацию приложения при использовании моего Сервиса, время и дату использования
        вами Сервиса и другую статистику.
      </Paragraph>
      <Title className="site-page-title" level={3}>
        Файлы cookie
      </Title>
      <Paragraph>
        Файлы cookie - это файлы с небольшим объемом данных, которые обычно используются в качестве
        анонимных уникальных идентификаторов. Они отправляются в ваш браузер с веб-сайтов, которые
        вы посещаете, и хранятся во внутренней памяти вашего устройства. Этот Сервис не использует
        эти “файлы cookie” явно. Однако приложение может использовать код сторонних производителей и
        библиотеки, которые используют “файлы cookie” для сбора информации и улучшения своих услуг.
        У вас есть возможность принять или отклонить эти файлы cookie и узнать, когда они
        отправляются на ваше устройство. Если вы решите отказаться от наших файлов cookie, вы не
        сможете использовать некоторые части этой Услуги.
      </Paragraph>
      <Title className="site-page-title" level={3}>
        Поставщики услуг
      </Title>
      <Paragraph>
        Я могу нанимать сторонние компании и частных лиц по следующим причинам:
        <ul>
          <li>Для облегчения работы нашего Сервиса;</li>
          <li>Предоставлять Услугу от нашего имени;</li>
          <li>Для предоставления услуг, связанных с Сервисом; или</li>
          <li>Чтобы помочь нам в анализе того, как используется наш Сервис.</li>
        </ul>
        Я хочу проинформировать пользователей этого Сервиса о том, что эти третьи лица имеют доступ
        к их Личной информации. Причина заключается в выполнении возложенных на них задач от нашего
        имени. Однако они обязаны не разглашать и не использовать информацию для каких-либо других
        целей.
      </Paragraph>
      <Title className="site-page-title" level={3}>
        Безопасность
      </Title>
      <Paragraph>
        Я ценю ваше доверие к предоставлению нам вашей Личной информации, поэтому мы стремимся
        использовать коммерчески приемлемые средства ее защиты. Но помните, что ни один способ
        передачи данных через Интернет или электронного хранения не является на 100% безопасным, и я
        не могу гарантировать его абсолютную безопасность.
      </Paragraph>
      <Title className="site-page-title" level={3}>
        Ссылки на другие сайты
      </Title>
      <Paragraph>
        Этот Сервис может содержать ссылки на другие сайты. Если вы нажмете на ссылку сторонних
        производителей, вы будете перенаправлены на этот сайт. Обратите внимание, что я не управляю
        этими внешними сайтами. Поэтому я настоятельно рекомендую вам ознакомиться с Политикой
        конфиденциальности этих веб-сайтов. Я не контролирую и не несу никакой ответственности за
        содержание, политику конфиденциальности или практику любых сторонних сайтов или сервисов.
      </Paragraph>
      <Title className="site-page-title" level={3}>
        Конфиденциальность детей
      </Title>
      <Paragraph>
        Эти Сервисы не предназначены для лиц младше 13 лет. Я сознательно не собираю личную
        информацию от детей младше 13 лет. В случае, если я обнаружу, что ребенок младше 13 лет
        предоставил мне личную информацию, я немедленно удаляю ее с наших серверов. Если вы
        являетесь родителем или опекуном и вам известно, что ваш ребенок предоставил нам личную
        информацию, пожалуйста, свяжитесь со мной, чтобы я смог выполнить необходимые действия.
      </Paragraph>
      <Title className="site-page-title" level={3}>
        Изменения в этой Политике конфиденциальности
      </Title>
      <Paragraph>
        Я могу время от времени обновлять нашу Политику конфиденциальности. Таким образом, вам
        рекомендуется периодически просматривать эту страницу на предмет любых изменений. Я уведомлю
        вас о любых изменениях, разместив новую Политику конфиденциальности на этой странице.
        Настоящая политика вступает в силу с 2024-02-19
      </Paragraph>
      <Title className="site-page-title" level={3}>
        Связаться с нами
      </Title>
      <Paragraph>
        Политики конфиденциальности, не стесняйтесь обращаться ко мне по адресу korobprog@gmail.com.
      </Paragraph>
    </BaseLayout>
  );
};
