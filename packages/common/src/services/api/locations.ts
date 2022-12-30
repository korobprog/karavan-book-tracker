import React from "react";
import { addDoc, query, where, setDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { getHashMap } from "common/src/utils/getHashMap";
import { apiRefs } from "./refs";

export type LocationsStatisticType = {
  totalPoints: number;
  totalPrimaryCount: number;
  totalOtherCount: number;
  totalOnlineCount: number;
  totalOnlinePoints: number;
};

export const defaultYearLocationStatistic = {
  totalPoints: 0,
  totalPrimaryCount: 0,
  totalOnlineCount: 0,
  totalOnlinePoints: 0,
  totalOtherCount: 0,
};

export type LocationDoc = {
  id?: string;
  name: string;
  country?: string;
  coordinates?: number[];
  image?: string;
  statistic?: Record<number, LocationsStatisticType>;
};

export const addLocation = async (data: LocationDoc) => {
  addDoc(apiRefs.locations, data);
};

export const editLocation = async (id: string, data: LocationDoc) => {
  setDoc(apiRefs.location(id), data);
};

export const setCoordinates = (x: number, y: number, location: LocationDoc) => {
  const { id, ...newLocation }: LocationDoc = {
    ...location,
    coordinates: [x, y],
  };
  if (id) {
    editLocation(id, newLocation);
  }
};

export type UseLocationsParams = {
  searchString?: string;
};

export const useLocations = (params?: UseLocationsParams) => {
  const { searchString = "" } = params || {};
  const [locationsDocData, locationsDocLoading] =
    useCollectionData<LocationDoc>(
      searchString
        ? query(
            apiRefs.locations,
            where("name", ">=", searchString),
            where("name", "<=", searchString + "\uf8ff")
          )
        : apiRefs.locations
    );

  const locationsHashMap = React.useMemo(() => {
    return locationsDocData ? getHashMap<LocationDoc>(locationsDocData) : null;
  }, [locationsDocData]);

  return {
    locations: locationsDocData || [],
    locationsHashMap,
    loading: locationsDocLoading,
  };
};
