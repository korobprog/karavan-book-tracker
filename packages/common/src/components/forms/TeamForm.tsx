import React, { useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { useTransitionNavigate } from "common/src/utils/hooks/useTransitionNavigate";
import { useDebouncedCallback } from "use-debounce";
import { useUsers } from "common/src/services/api/useUsers";
import { routes } from "../../../../admin/src/shared/routes";
import { UserSelect } from "common/src/components/UserSelect";
import { TeamFormValues } from "common/src/services/teams";
import { removeEmptyFields } from "common/src/utils/objects";
import { SelectLocation } from "../../features/select-location/SelectLocation";
import { TeamMemberStatus, setUserTeam } from "../../services/api/useUser";

type Props = {
  onFinishHandler: (formValues: TeamFormValues) => Promise<void>;
  initialValues?: TeamFormValues;
  teamId?: string;
  leaderIdDisabled?: boolean;
};

export const TeamForm = (props: Props) => {
  const { onFinishHandler, initialValues, teamId, leaderIdDisabled } = props;
  const navigate = useTransitionNavigate();

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

      if (teamId) {
        // Удаляем предыдущих лидеров
        const prevLeaders = usersDocData?.filter(
          (user) => user.team?.id === teamId && user.id !== leaderId
        );
        const promises = prevLeaders.map((prevLeader) => {
          setUserTeam(
            { id: prevLeader.team?.id || teamId, status: TeamMemberStatus.member },
            prevLeader.id
          );
        });
        await Promise.allSettled(promises);
      }

      // Сабмитим форму..
      await onFinishHandler({
        leaderId,
        ...removeEmptyFields(formValues),
      }).finally(() => setIsSubmitting(false));
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const usersWithoutAdmin = usersDocData?.filter(
    (usersDocData) =>
      usersDocData.id === initialValues?.leaderId ||
      usersDocData.team?.status !== TeamMemberStatus.admin
  );

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
          disabled={leaderIdDisabled}
          onAddNewUser={() => navigate(routes.usersNew)}
          userSearchString={userSearchString}
        >
          {usersOptions}
        </UserSelect>
      </Form.Item>
      <Form.Item name="location" label="Место базирования">
        <SelectLocation name="location" />
      </Form.Item>
      <Form.Item name="currentLocation" label="Текущее место пребывания">
        <SelectLocation name="currentLocation" />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          СОХРАНИТЬ
        </Button>
      </Form.Item>
    </Form>
  );
};
