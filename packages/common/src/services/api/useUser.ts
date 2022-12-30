import {
  setDoc,
  updateDoc,
  addDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { apiRefs } from "./refs";
import { UserStatisticType } from "./statistic";

export type UserRoles = "admin";

export enum TeamMemberStatus {
  admin = "admin",
  request = "request",
  member = "member",
}

export type UserTeam = {
  id: string;
  status: TeamMemberStatus;
};

export type UserDoc = {
  name?: string;
  nameSpiritual?: string;
  phone?: string;
  address?: string;
  city?: string;
  favorite?: string[];
  role?: UserRoles;
  statistic?: Record<number, UserStatisticType>;
  email?: string;
  isUnattached?: boolean;
  team?: UserTeam | null;
};

export type UserDocWithId = UserDoc & {
  id: string;
};

type Params = {
  profile: UserDocWithId | null;
};

export const useUser = ({ profile }: Params) => {
  const id = profile?.id;

  const toggleFavorite = async (favoriteId: string) => {
    if (id) {
      if (profile?.favorite?.includes(favoriteId)) {
        const filteredFavorite = profile.favorite.filter(
          (value) => value !== favoriteId
        );
        await setDoc(apiRefs.user(id), {
          ...profile,
          favorite: filteredFavorite,
        });
      } else {
        const newFavorite = [...(profile?.favorite || []), favoriteId];
        await setDoc(apiRefs.user(id), {
          ...profile,
          favorite: newFavorite,
        });
      }
    }
  };

  const setProfile = async (newProfile: UserDoc) => {
    if (profile && id) {
      await setDoc(apiRefs.user(id), { ...profile, ...newProfile });
    }
  };

  const deleteProfile = async (id: string) => {
    const operationRef = apiRefs.user(id);
    await deleteDoc(operationRef);
  };

  const addNewUnattachedProfile = async (newProfile: UserDoc) => {
    if (profile) {
      await addDoc(apiRefs.addUser, { ...newProfile, isUnattached: true });
    }
  };

  const rewriteUserStatistic = (newBooks: UserStatisticType, user?: UserDoc) => ({
    ...user,
    statistic: {
      "2022": {
        count: (user?.statistic?.[2022]?.count || 0) + newBooks.count,
        points: (user?.statistic?.[2022]?.points || 0) + newBooks.points,
      },
    },
  });

  const addStatistic = async (
    newBooks: UserStatisticType,
    selectedUserId?: string
  ) => {
    if (selectedUserId) {
      const selectedUser = (await getDoc(apiRefs.user(selectedUserId))).data();

      await setDoc(
        apiRefs.user(selectedUserId),
        rewriteUserStatistic(newBooks, selectedUser)
      );

      return;
    }

    if (profile) {
      await setDoc(
        apiRefs.user(profile.id),
        rewriteUserStatistic(newBooks, profile)
      );
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

export const setUserTeam = async (team: UserTeam | null, userId?: string) => {
  if (userId) {
    await updateDoc(apiRefs.user(userId), { team });
  }
};
