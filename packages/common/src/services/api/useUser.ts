import { useDocumentData } from "react-firebase-hooks/firestore";
import { User } from "firebase/auth";
import { setDoc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { apiRefs } from "./refs";
import { UserStatisticType } from "./statistic";


export type UserRoles = "admin" | "authorized";

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
  phone?: string; // Контактный номер телефона
  address?: string; // Адрес, куда высылать подарки
  city?: string; // Текущее местоположение
  yatraLocationId?: string; // К какой ятре прикреплен
  favorite?: string[]; // Избранные книги
  role?: UserRoles[];
  statistic?: Record<number, UserStatisticType>;
  email?: string;
  isUnattached?: boolean; // Профиль не привязан к конкретному аккаунту
  team?: UserTeam | null; // Членство в передвижной команде
  registrationDate?: string;
  avatar?: string;
};

export type UserDocWithId = UserDoc & {
  id: string;
};

type Params = {
  profile: UserDocWithId | null;
  user?: User | null;
};

export const updateProfile = async (id: string, profile: Partial<UserDoc>) => {
  await updateDoc(apiRefs.user(id), profile);
};


export const useProfileById = (id?: string) => {
  const [profile, loading] = useDocumentData<UserDoc>(id ? apiRefs.user(id) : null);
  return { profile, loading };
};

export const useUser = ({ profile, user }: Params) => {
  const id = profile?.id || user?.uid;

  const toggleFavorite = async (favoriteId: string) => {
    if (id) {
      if (profile?.favorite?.includes(favoriteId)) {
        const filteredFavorite = profile.favorite.filter((value) => value !== favoriteId);
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
    if (id) {
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

  return {
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
