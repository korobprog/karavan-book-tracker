import { addTeam, EditTeamDoc, setTeam } from "common/src/services/api/teams";
import { setUserTeam, TeamMemberStatus } from "common/src/services/api/useUser";

export type TeamFormValues = {
  name: string;
  leaderId: string;
  location?: string;
  currentLocation?: string;
  //   parentId: string | null;
  //   leader: { id: string; name: string };
  //   members: string[];
  //   requests?: string[];
  //   created: string;
  //   founded?: string;
  //   image?: string;
};

export type SaveTeamParams = {
  teamId?: string;
  team: TeamFormValues;
};

export const saveTeam = ({ teamId, team }: SaveTeamParams) => {
  const created = new Date().toISOString();

  const params: EditTeamDoc = {
    ...team,
    parentId: null,
    created,
    leader: {
      id: team.leaderId,
    },
    members: [team.leaderId],
  };

  const editTeamMethod = teamId
    ? (params: EditTeamDoc) => setTeam(teamId, params)
    : addTeam;

  return editTeamMethod(params).then((response) => {
    setUserTeam(
      { id: response.id, status: TeamMemberStatus.admin },
      team.leaderId
    );
  });
};
