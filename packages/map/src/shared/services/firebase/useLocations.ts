import { collection, CollectionReference, getFirestore, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { idConverter } from "./utils";

export type LocationsStatisticType = {
  totalPoints: number;
  totalPrimaryCount: number;
  totalOtherCount: number;
  totalOnlineCount: number;
  totalOnlinePoints: number;
};

export type LocationDoc = {
  id?: string;
  name: string;
  country?: string;
  coordinates?: number[];
  image?: string;
  statistic?: Record<string, LocationsStatisticType>;
};

export type UseLocationsParams = {
  searchString?: string;
};

const db = getFirestore();

const locationsRef = collection(db, "locations").withConverter(
  idConverter
) as CollectionReference<LocationDoc>;

export const useLocations = ({ searchString = "" }: UseLocationsParams) => {
  const [locationsDocData, locationsDocLoading] = useCollectionData<LocationDoc>(
    searchString
      ? query(
          locationsRef,
          where("name", ">=", searchString),
          where("name", "<=", searchString + "\uf8ff")
        )
      : locationsRef
  );

  return {
    locations: locationsDocData || [],
    loading: locationsDocLoading,
  };
};
