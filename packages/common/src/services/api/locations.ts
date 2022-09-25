import React from "react";
import {
  collection,
  CollectionReference,
  getFirestore,
  addDoc,
  query,
  where,
  setDoc,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { idConverter } from "./utils";
import { getHashMap } from "common/src/utils/getHashMap";

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
  statistic?: {
    "2022"?: LocationsStatisticType;
    "2023"?: LocationsStatisticType;
  };
};

const db = getFirestore();

const locationsRef = collection(db, "locations").withConverter(
  idConverter
) as CollectionReference<LocationDoc>;

const getLocationRefById = (id: string) =>
  doc(db, "locations", id) as DocumentReference<LocationDoc>;

export const addLocation = async (data: LocationDoc) => {
  addDoc(locationsRef, data);
};

export const editLocation = async (id: string, data: LocationDoc) => {
  setDoc(getLocationRefById(id), data);
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
            locationsRef,
            where("name", ">=", searchString),
            where("name", "<=", searchString + "\uf8ff")
          )
        : locationsRef
    );

  const locationsHashMap = React.useMemo(() => {
    return locationsDocData
      ? (getHashMap<LocationDoc>(locationsDocData))
      : null;
  }, [locationsDocData]);

  return {
    locations: locationsDocData || [],
    locationsHashMap,
    loading: locationsDocLoading,
  };
};
