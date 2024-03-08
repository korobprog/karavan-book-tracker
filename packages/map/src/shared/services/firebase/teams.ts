import {
  collection,
  CollectionReference,
  getFirestore,
  addDoc,
  setDoc,
  doc,
  DocumentReference,
  query,
  where,
} from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
// import { UserDoc } from "./useUser";

import { idConverter } from "./utils";

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

const db = getFirestore();

const teamsRef = collection(db, "teams").withConverter(idConverter) as CollectionReference<TeamDoc>;

const getTeamRefById = (id: string) => doc(db, "teams", id) as DocumentReference<TeamDoc>;

export const addTeam = async (data: EditTeamDoc) => {
  return await addDoc(teamsRef, data);
};

export const setTeam = async (id: string, data: EditTeamDoc) => {
  return await setDoc(getTeamRefById(id), data).then(() => ({ id, ...data }));
};

export type UseTeamsParams = {
  searchString?: string;
};

export const useTeams = (params?: UseTeamsParams) => {
  const { searchString = "" } = params || {};
  const [teamsDocData, teamsDocLoading] = useCollectionData<TeamDoc>(
    searchString
      ? query(
          teamsRef,
          where("name", ">=", searchString),
          where("name", "<=", searchString + "\uf8ff")
        )
      : teamsRef
  );

  return {
    teams: teamsDocData || [],
    loading: teamsDocLoading,
  };
};

export const useTeam = (id: string) => {
  const teamRef = getTeamRefById(id);
  const [teamDocData, teamsDocLoading] = useDocumentData<TeamDoc>(teamRef);

  return {
    team: teamDocData,
    loading: teamsDocLoading,
  };
};

// const usersRef = collection(db, "users").withConverter(
//   idConverter
// ) as CollectionReference<UserDoc>;

// export type UseTeamsMembersParams = {
//   teamId?: string;
// };

// export const useTeamMembers = (params: UseTeamsMembersParams) => {
//   const { teamId = "" } = params;

//   const [teamMembers = [], loading] = useCollectionData<UserDoc>(
//     query(usersRef, where("team.id", "==", teamId))
//   );

//   return { teamMembers, loading };
// };
