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
import { CurrentUser } from "./useCurrentUser";
import { idConverter } from "./utils";

export type UserRoles = "admin";

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
};

type Params = {
  currentUser: CurrentUser;
};

export const useUser = ({ currentUser }: Params) => {
  const db = getFirestore();
  const { user, favorite, profile } = currentUser;
  const userRef = (
    user ? doc(db, "users", user?.uid).withConverter(idConverter) : null
  ) as DocumentReference<UserDoc> | null;
  const usersRef = (
    user ? collection(db, "users").withConverter(idConverter) : null
  ) as CollectionReference<UserDoc> | null;

  const toggleFavorite = async (favoriteId: string) => {
    if (user && userRef) {
      if (favorite.includes(favoriteId)) {
        const filteredFavorite = favorite.filter(
          (value) => value !== favoriteId
        );
        await setDoc(userRef, { ...profile, favorite: filteredFavorite });
      } else {
        const newFavorite = [...favorite, favoriteId];
        await setDoc(userRef, { ...profile, favorite: newFavorite });
      }
    }
  };

  const setProfile = async (newProfile: UserDoc) => {
    if (user && userRef) {
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
    if (user && usersRef) {
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

    if (user && userRef) {
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
