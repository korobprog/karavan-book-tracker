import { addDoc, setDoc, query, where } from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { apiRefs } from "./refs";

export type TeamDoc = {
  id: string;
  name: string;
  parentId: string | null;
  leader: { id: string };
  members: string[];
  requests?: string[];
  created: string;
  founded?: string;
  location?: string;
  image?: string;
  currentLocation?: string;
};

export type EditTeamDoc = Omit<TeamDoc, "id">;

export const addTeam = async (data: EditTeamDoc) => {
  return await addDoc(apiRefs.teams, data);
};

export const setTeam = async (id: string, data: EditTeamDoc) => {
  return await setDoc(apiRefs.team(id), data).then(() => ({ id, ...data }));
};

export type UseTeamsParams = {
  searchString?: string;
};

export const useTeams = (params?: UseTeamsParams) => {
  const { searchString = "" } = params || {};
  const [teamsDocData, teamsDocLoading] = useCollectionData<TeamDoc>(
    searchString
      ? query(
          apiRefs.teams,
          where("name", ">=", searchString),
          where("name", "<=", searchString + "\uf8ff")
        )
      : apiRefs.teams
  );

  return {
    teams: teamsDocData || [],
    loading: teamsDocLoading,
  };
};

export const useTeam = (id: string) => {
  const [teamDocData, teamsDocLoading] = useDocumentData<TeamDoc>(
    apiRefs.team(id)
  );

  return {
    team: teamDocData,
    loading: teamsDocLoading,
  };
};

export type UseTeamsMembersParams = {
  teamId?: string;
};

export const useTeamMembers = (params: UseTeamsMembersParams) => {
  const { teamId = "" } = params;

  const [teamMembers = [], loading] = useCollectionData(
    query(apiRefs.users, where("team.id", "==", teamId))
  );

  return { teamMembers, loading };
};
