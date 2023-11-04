import { CurrentUser } from "common/src/services/api/useCurrentUser";
import { DonationPageDoc, editDonationPageDoc } from "common/src/services/api/donation";
import { apiRefs } from "common/src/services/api/refs";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { PageForm } from "common/src/components/forms/profile/PageForm";
import { Typography, notification } from "antd";
import { BaseLayout } from "common/src/components/BaseLayout";
import { routes } from "../shared/routes";

type Props = {
  currentUser: CurrentUser;
};

const PageDonations = ({ currentUser }: Props) => {
  const { profile, user } = currentUser;

  const avatar = profile?.avatar;

  const initialPageDoc: DonationPageDoc = {
    banks: [],
    active: false,
    socialTelegram: "",
    socialWhats: "",
    socialLink: "",
    avatar: "",
    userName: "",
  };

  const userId = profile?.id || user?.uid || "";

  const [donationPageDocData, donationDocLoading] = useDocumentData<DonationPageDoc>(
    userId ? apiRefs.donationPage(userId) : null
  );

  const initialValues = donationPageDocData || initialPageDoc;

  const onFinish = async (formValues: DonationPageDoc) => {
    if (userId) {
      editDonationPageDoc(userId, formValues);
      const updatedValues: DonationPageDoc = {
        ...formValues,
        avatar: profile?.avatar,
        userName: profile?.name,
      };
      editDonationPageDoc(userId, updatedValues);
      notification.success({ message: "Страница успешно сохранена" });
    }
  };
  return (
    <BaseLayout title="Страница для пожертвований" isAdmin backPath={routes.root} avatar={avatar}>
      {donationDocLoading || !initialPageDoc ? (
        <Typography.Title className="site-page-title" level={5}>
          Загрузка...
        </Typography.Title>
      ) : (
        <PageForm initialValues={initialValues} onFinish={onFinish} currentUser={currentUser} />
      )}
    </BaseLayout>
  );
};

export default PageDonations;
