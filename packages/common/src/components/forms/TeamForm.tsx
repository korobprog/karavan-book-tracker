import React, { useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { useUsers } from "common/src/services/api/useUsers";
import { routes } from "../../../../admin/src/shared/routes";
import { UserSelect } from "common/src/components/UserSelect";
import { TeamFormValues } from "common/src/services/teams";
import { removeEmptyFields } from "common/src/utils/objects";
import { SelectLocation } from "../../features/select-location/SelectLocation";
import { TeamMemberStatus } from "../../services/api/useUser";

type Props = {
  onFinishHandler: (formValues: TeamFormValues) => Promise<void>;
  initialValues?: TeamFormValues;
};

export const TeamForm = (props: Props) => {
  const { onFinishHandler, initialValues } = props;
  const navigate = useNavigate();

  const [userSearchString, setUserSearchString] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { usersDocData } = useUsers({
    searchString: userSearchString,
  });

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onUserChange = useDebouncedCallback((value: string) => {
    setUserSearchString(value);
  }, 1000);

  const onFinish = async ({ leaderId, ...formValues }: TeamFormValues) => {
    if (!usersDocData) {
      return;
    }

    const leader = usersDocData.find((user) => user.id === leaderId);

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

  const usersWithoutAdmin =
    usersDocData &&
    usersDocData.filter((usersDocData) => usersDocData.team?.status !== TeamMemberStatus.admin);

  const usersOptions = usersWithoutAdmin?.map((d) => (
    <Select.Option key={d.id}>
      {d.name} {d.nameSpiritual}
    </Select.Option>
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
        <SelectLocation />
      </Form.Item>
      <Form.Item name="currentLocation" label="Текущее место пребывания">
        <SelectLocation />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          СОХРАНИТЬ
        </Button>
      </Form.Item>
    </Form>
  );
};
