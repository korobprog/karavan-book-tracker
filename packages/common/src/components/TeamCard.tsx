import React, { useMemo } from "react";
import { TeamDoc, useTeamMembers } from "common/src/services/api/teams";
import {
  Card,
  Typography,
  Button,
  Avatar,
  Tooltip,
  Space,
  Badge,
  Dropdown,
  MenuProps,
  Modal,
} from "antd";
import {
  TrophyOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  StarTwoTone,
  CheckCircleOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { LocationDoc } from "../services/api/locations";
import { HashMap } from "../utils/getHashMap";
import { setUserTeam, TeamMemberStatus, UserDocWithId } from "../services/api/useUser";
import { UsersStatistic } from "common/src/features/downloadUsersStatistic";
import { CurrentUser } from "common/src/services/api/useCurrentUser";

type Props = {
  team: TeamDoc;
  locationsHashMap: HashMap<LocationDoc> | null;
  children?: React.ReactNode;
  myStatus?: TeamMemberStatus;
  onLeaveTeam?: () => void;
  onTeamEdit?: (teamId: string) => void;
};

export const TeamCard = ({
  team,
  myStatus,
  locationsHashMap,
  onLeaveTeam,
  onTeamEdit,
  children,
}: Props) => {
  const { name, location, currentLocation, leader } = team;

  const { teamMembers } = useTeamMembers({ teamId: team?.id });

  const locationName = location && locationsHashMap ? locationsHashMap[location].name : "";
  const currentLocationName =
    currentLocation && locationsHashMap ? locationsHashMap[currentLocation]?.name : "";

  const description = `${locationName} ${
    currentLocationName ? `(где сейчас: ${currentLocationName})` : ""
  }`;

  const onAcceptMember = (memberProfile: UserDocWithId) => {
    setUserTeam({ id: team.id, status: TeamMemberStatus.member }, memberProfile.id);
  };

  const approvedTeamMembers = teamMembers?.filter((user) => {
    return user.team?.status !== TeamMemberStatus.request && user.id !== leader.id;
  });

  const requestTeamMembers = teamMembers?.filter((user) => {
    return user.team?.status === TeamMemberStatus.request;
  });

  const teamLeader = teamMembers?.filter((user) => {
    return user.team?.status === TeamMemberStatus.admin;
  });

  const items = useMemo(() => {
    const result: MenuProps["items"] = [];

    const showLeaveConfirm = () => {
      Modal.confirm({
        title: "Вы хотите выйти из этой группы?",
        icon: <ExclamationCircleOutlined />,
        okText: "Покинуть группу",
        okType: "danger",
        cancelText: "Отмена",
        onOk: (close) => {
          onLeaveTeam?.();
          close();
        },
      });
    };

    if (onTeamEdit) {
      result.push({
        label: "Редактировать",
        key: "edit",
        icon: <UserOutlined />,
        onClick: () => onTeamEdit?.(team.id),
      });
    }
    if (onLeaveTeam) {
      result.push({
        label: "Выйти из группы",
        key: "leave",
        icon: <UserOutlined />,
        onClick: showLeaveConfirm,
        danger: true,
      });
    }
    return result;
  }, [team, onLeaveTeam, onTeamEdit]);

  return (
    <>
      <Card style={{ marginTop: 16 }} actions={[children]}>
        <Space>
          <Card.Meta avatar={<TrophyOutlined />} title={name} description={description} />
          {items.length > 0 && (
            <Dropdown menu={{ items }}>
              <Button
                size="middle"
                type="default"
                icon={<MoreOutlined />}
                style={{ marginLeft: "auto" }}
              ></Button>
            </Dropdown>
          )}
        </Space>
        <div>
          <Space style={{ marginTop: 14 }}>
            Участники:
            <Avatar.Group>
              <Tooltip title={teamLeader[0]?.nameSpiritual || teamLeader[0]?.name} placement="top">
                <Badge count={<StarTwoTone twoToneColor="#e4db30" />} offset={[-25, 5]}>
                  {teamLeader[0]?.avatar ? (
                    <Avatar style={{ backgroundColor: "#689cd0" }} src={teamLeader[0]?.avatar} />
                  ) : (
                    <Avatar style={{ backgroundColor: "#689cd0" }} icon={<UserOutlined />} />
                  )}
                </Badge>
              </Tooltip>
              {approvedTeamMembers?.map(({ name, nameSpiritual, id, avatar }) => (
                <Tooltip key={id} title={nameSpiritual || name} placement="top">
                  {avatar ? (
                    <Avatar style={{ backgroundColor: "#87d068" }} src={avatar} />
                  ) : (
                    <Avatar style={{ backgroundColor: "#87d068" }} icon={<UserOutlined />} />
                  )}
                </Tooltip>
              ))}
            </Avatar.Group>
          </Space>
        </div>
        {myStatus === TeamMemberStatus.request && (
          <div className="site-page-title">
            <Typography.Paragraph style={{ marginTop: 14 }}>
              Заявка на рассмотрении <ClockCircleOutlined />
            </Typography.Paragraph>
            {onLeaveTeam && (
              <Button
                size="small"
                type="dashed"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => onLeaveTeam()}
                style={{ marginLeft: "auto" }}
              >
                Отменить заявку
              </Button>
            )}
          </div>
        )}

        {myStatus === TeamMemberStatus.admin && Boolean(requestTeamMembers?.length) && (
          <div>
            <Typography.Paragraph className="site-page-title">
              Заявки в группу <ClockCircleOutlined />
            </Typography.Paragraph>

            {requestTeamMembers.map((requestMember) => (
              <Space key={requestMember.id} style={{ marginBottom: 8 }}>
                <Button
                  size="small"
                  type="dashed"
                  icon={<CheckCircleOutlined />}
                  onClick={() => onAcceptMember(requestMember)}
                  style={{ marginLeft: "auto" }}
                >
                  Принять заявку
                </Button>
                <Avatar style={{ backgroundColor: "#87d068" }} icon={<UserOutlined />} />
                <Typography.Text>
                  {requestMember.name} ({requestMember.nameSpiritual})
                </Typography.Text>
              </Space>
            ))}
          </div>
        )}
        {(myStatus === TeamMemberStatus.admin || myStatus === TeamMemberStatus.member) && (
          <UsersStatistic teamMembers={teamMembers.map((member) => member.id)} />
        )}
      </Card>
    </>
  );
};
