import {
  doc,
  collection,
  DocumentReference,
  getFirestore,
  setDoc,
  addDoc,
  CollectionReference,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { StatisticType } from "./statistic";
import { idConverter } from "./utils";

export type UserRoles = "admin";

export enum TeamMemberStatus {
  admin = 'admin',
  request = 'request',
  member = 'member',
}

export type UserTeam = {
  id: string;
  status: TeamMemberStatus;
};

export type UserDoc = {
  id?: string;
  name?: string;
  nameSpiritual?: string;
  phone?: string;
  address?: string;
  city?: string;
  favorite?: string[];
  role?: UserRoles;
  statistic?: {
    "2022": StatisticType;
  };
  email?: string;
  isUnattached?: boolean;
  team?: UserTeam | null;
};

type Params = {
  profile?: UserDoc;
};

const db = getFirestore();

const getUserRef = (userId: string | undefined) => (
  userId ? doc(db, "users", userId).withConverter(idConverter) : null
) as DocumentReference<UserDoc> | null;

export const useUser = ({ profile }: Params) => {
  const userRef = getUserRef(profile?.id);

  const usersRef = (
    collection(db, "users").withConverter(idConverter)
  ) as CollectionReference<UserDoc> | null;

  const toggleFavorite = async (favoriteId: string) => {
    if (userRef && profile?.favorite) {
      if (profile.favorite.includes(favoriteId)) {
        const filteredFavorite = profile.favorite.filter(
          (value) => value !== favoriteId
        );
        await setDoc(userRef, { ...profile, favorite: filteredFavorite });
      } else {
        const newFavorite = [...profile.favorite, favoriteId];
        await setDoc(userRef, { ...profile, favorite: newFavorite });
      }
    }
  };

  const setProfile = async (newProfile: UserDoc) => {
    if (profile && userRef) {
      await setDoc(userRef, { ...profile, ...newProfile });
    }
  };

  const deleteProfile = async (id?: string) => {
    if (id) {
      const operationRef = doc(db, "users", id);
      await deleteDoc(operationRef);
    }
  };

  const addNewUnattachedProfile = async (newProfile: UserDoc) => {
    if (profile && usersRef) {
      await addDoc(usersRef, { ...newProfile, isUnattached: true });
    }
  };

  const rewriteUserStatistic = (newBooks: StatisticType, user?: UserDoc) => ({
    ...user,
    statistic: {
      "2022": {
        count: (user?.statistic?.[2022].count || 0) + newBooks.count,
        points: (user?.statistic?.[2022].points || 0) + newBooks.points,
      },
    },
  });

  const addStatistic = async (
    newBooks: StatisticType,
    selectedUserId?: string
  ) => {
    if (selectedUserId) {
      const selectedUserRef = doc(
        db,
        "users",
        selectedUserId
      ) as DocumentReference<UserDoc>;

      const selectedUser = (await getDoc(selectedUserRef)).data();

      await setDoc(
        selectedUserRef,
        rewriteUserStatistic(newBooks, selectedUser)
      );

      return;
    }

    if (profile && userRef) {
      await setDoc(userRef, rewriteUserStatistic(newBooks, profile));
      return;
    }
  };

  return {
    addStatistic,
    toggleFavorite,
    setProfile,
    deleteProfile,
    addNewUnattachedProfile,
  };
};

export const setUserTeam = async (team: UserTeam | null, profile?: UserDoc) => {
  const userRef = getUserRef(profile?.id);

  if (profile && userRef) {

    await setDoc(userRef, { ...profile, team });
  }
};
