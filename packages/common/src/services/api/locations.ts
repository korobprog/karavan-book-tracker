import React from "react";
import { addDoc, query, where, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { getHashMap } from "common/src/utils/getHashMap";
import { apiRefs } from "./refs";
import { usePreloadedData } from "../../utils/memo/usePreloadedData";

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
  name?: string;
  country?: string;
  coordinates?: number[];
  image?: string;
  statistic?: Record<number, LocationsStatisticType>;
};

export const addLocation = async (data: LocationDoc) => {
  return addDoc(apiRefs.locations, data);
};

export const editLocation = async (id: string, data: LocationDoc) => {
  setDoc(apiRefs.location(id), data);
};

export const updateLocation = async (id: string, data: Partial<LocationDoc>) => {
  updateDoc(apiRefs.location(id), data);
};

export const deleteLocation = async (id: string) => {
  deleteDoc(apiRefs.location(id));
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

  const [locationsDocData, locationsDocLoading] = useCollectionData<LocationDoc>(
    searchString
      ? query(
          apiRefs.locations,
          where("name", ">=", searchString),
          where("name", "<=", searchString + "\uf8ff")
        )
      : apiRefs.locations
  );

  const locations = usePreloadedData(locationsDocData, locationsDocLoading);

  const locationsHashMap = React.useMemo(() => {
    return locations ? getHashMap<LocationDoc>(locations) : null;
  }, [locations]);

  return {
    locations: locations || [],
    locationsHashMap,
    loading: locationsDocLoading,
  };
};
