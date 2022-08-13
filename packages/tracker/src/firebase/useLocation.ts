import {
  getFirestore,
  setDoc,
  DocumentReference,
  doc,
  getDoc,
} from "firebase/firestore";
import { StatisticType } from "./statistic";
import { idConverter } from "./utils";

export type LocationsStatisticType = {
  primary: StatisticType;
  other: StatisticType;
  online: StatisticType;
  total: StatisticType;
};

export type LocationDoc = {
  id?: string;
  name: string;
  country?: string;
  coordinates?: number[];
  image?: string;
  statistic?: {
    "2022"?: LocationsStatisticType;
  };
};

const emptyStat: StatisticType = {
  count: 0,
  points: 0,
};

const yearEmptyStat: LocationsStatisticType = {
  primary: emptyStat,
  other: emptyStat,
  online: emptyStat,
  total: emptyStat,
};

export const useLocation = () => {
  const db = getFirestore();

  const addLocationStatistic = async (
    newBooks: Partial<LocationsStatisticType>,
    locationId: string,
    isOnline?: boolean
  ) => {
    if (!locationId) {
      return;
    }
    const locationRef = doc(db, "locations", locationId).withConverter(
      idConverter
    ) as DocumentReference<LocationDoc>;

    const locationDoc = await getDoc(locationRef);
    const location = locationDoc.data();

    if (!location) {
      return;
    }

    const statistic = location.statistic?.[2022] || yearEmptyStat;
    statistic.total.count += newBooks.total?.count || 0;
    statistic.total.points += newBooks.total?.points || 0;
    statistic.primary.count += newBooks.primary?.count || 0;
    statistic.primary.points += newBooks.primary?.points || 0;
    statistic.other.count += newBooks.other?.count || 0;
    statistic.other.points += newBooks.other?.points || 0;
    if (isOnline) {
      statistic.online.count += newBooks.total?.count || 0;
      statistic.online.points += newBooks.total?.points || 0;
    }

    await setDoc(locationRef, {
      ...location,
      statistic: {
        "2022": statistic,
      },
    });
  };

  return { addLocationStatistic };
};
