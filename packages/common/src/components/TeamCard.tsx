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
  Row,
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
import { Helper } from "./Helper";
import { useTranslation } from "react-i18next";

type Props = {
  team: TeamDoc;
  locationsHashMap: HashMap<LocationDoc> | null;
  children?: React.ReactNode;
  myStatus?: TeamMemberStatus;
  onLeaveTeam?: () => void;
  onTeamEdit?: (teamId: string) => void;
  isAdmin?: boolean;
};

export const TeamCard = ({
  team,
  myStatus,

  onLeaveTeam,
  onTeamEdit,
  children,
  isAdmin,
}: Props) => {
  const { t } = useTranslation();
  const { name, leader } = team;

  const { teamMembers } = useTeamMembers({ teamId: team?.id });

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
        title: t("common.team_card.leave_question"),
        icon: <ExclamationCircleOutlined />,
        okText: t("common.team_card.leave"),
        okType: "danger",
        cancelText: t("common.cancel"),
        onOk: (close) => {
          onLeaveTeam?.();
          close();
        },
      });
    };

    if (onTeamEdit) {
      result.push({
        label: t("common.edit"),
        key: "edit",
        icon: <UserOutlined />,
        onClick: () => onTeamEdit?.(team.id),
      });
    }
    if (onLeaveTeam) {
      result.push({
        label: t("common.team_card.leave"),
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
        <Row justify="space-between">
          <Card.Meta avatar={<TrophyOutlined />} title={name} />
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
        </Row>
        <Row justify="space-between">
          <Space style={{ marginTop: 14 }}>
            {t("common.team_card.members")}
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
          <Helper title={t("common.team_card.helper")} />
        </Row>
        {myStatus === TeamMemberStatus.request && (
          <div className="site-page-title">
            <Typography.Paragraph style={{ marginTop: 14 }}>
              {t("common.team_card.under_consideration")} <ClockCircleOutlined />
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
                {t("common.team_card.cancel_applications")}
              </Button>
            )}
          </div>
        )}

        {myStatus === TeamMemberStatus.admin && Boolean(requestTeamMembers?.length) && (
          <div>
            <Typography.Paragraph className="site-page-title">
              {t("common.team_card.applications")} <ClockCircleOutlined />
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
                  {t("common.team_card.accept_application")}
                </Button>
                <Avatar style={{ backgroundColor: "#87d068" }} icon={<UserOutlined />} />
                <Typography.Text>
                  {requestMember.name} ({requestMember.nameSpiritual})
                </Typography.Text>
              </Space>
            ))}
          </div>
        )}
        {(isAdmin ||
          myStatus === TeamMemberStatus.admin ||
          myStatus === TeamMemberStatus.member) && (
          <UsersStatistic teamMembers={teamMembers.map((member) => member.id)} />
        )}
      </Card>
    </>
  );
};
