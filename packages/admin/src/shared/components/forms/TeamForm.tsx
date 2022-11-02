import { useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { addLocation, useLocations } from "common/src/services/api/locations";
import { useDebouncedCallback } from "use-debounce";
import { useUsers } from "common/src/services/api/useUsers";
import { routes } from "../../routes";
import { UserSelect } from "../UserSelect";
import { LocationSelect } from "../LocationSelect";
import { TeamFormValues } from "common/src/services/teams";
import { removeEmptyFields } from "common/src/utils/objects";

type Props = {
  onFinishHandler: (formValues: TeamFormValues) => Promise<void>;
  initialValues?: TeamFormValues;
};

export const TeamForm = (props: Props) => {
  const { onFinishHandler, initialValues } = props;
  const navigate = useNavigate();

  const [locationSearchString, setLocationSearchString] = useState("");
  const [userSearchString, setUserSearchString] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { locations } = useLocations({
    searchString: locationSearchString,
  });
  const { usersDocData } = useUsers({
    searchString: userSearchString,
  });

  const onLocationChange = useDebouncedCallback((value: string) => {
    setLocationSearchString(value.charAt(0).toUpperCase() + value.slice(1));
  }, 1000);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onAddNewLocation = () => {
    addLocation({ name: locationSearchString });
    setLocationSearchString("");
  };

  const onUserChange = useDebouncedCallback((value: string) => {
    setUserSearchString(value);
  }, 1000);

  const onFinish = async ({ leaderId, ...formValues }: TeamFormValues) => {
    if (!usersDocData) {
      return;
    }

    const leader = usersDocData.find((user) => user.id === leaderId);

    // ! TODO: add founded date;
    // ! TODO: Добавить - выбор родительской команды

    if (leader) {
      setIsSubmitting(true);
      await onFinishHandler({
        leaderId,
        ...removeEmptyFields(formValues),
      }).finally(() => setIsSubmitting(false));
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const usersOptions = usersDocData?.map((d) => (
    <Select.Option key={d.id}>
      {d.name} {d.nameSpiritual}
    </Select.Option>
  ));

  const locationOptions = locations?.map((d) => (
    <Select.Option key={d.id}>{d.name}</Select.Option>
  ));

  return (
    <Form
      name="basic"
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      {...layout}
    >
      <Form.Item
        name="name"
        label="Название"
        rules={[{ required: true, message: "Введите название" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="leaderId"
        label="Лидер группы"
        rules={[{ required: true, message: "Выберите лидера" }]}
      >
        <UserSelect
          onSearch={onUserChange}
          onAddNewUser={() => navigate(routes.usersNew)}
          userSearchString={userSearchString}
        >
          {usersOptions}
        </UserSelect>
      </Form.Item>
      <Form.Item name="location" label="Место базирования">
        <LocationSelect
          onSearch={onLocationChange}
          onAddNewLocation={onAddNewLocation}
          locationSearchString={locationSearchString}
        >
          {locationOptions}
        </LocationSelect>
      </Form.Item>
      <Form.Item
        name="currentLocation"
        label="Текущее место пребывания"
      >
        <LocationSelect
          onSearch={onLocationChange}
          onAddNewLocation={onAddNewLocation}
          locationSearchString={locationSearchString}
        >
          {locationOptions}
        </LocationSelect>
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          СОХРАНИТЬ
        </Button>
      </Form.Item>
    </Form>
  );
};
