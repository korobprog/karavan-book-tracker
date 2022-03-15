import {
  collection,
  CollectionReference,
  getFirestore,
  addDoc,
  query,
  where,
  FirestoreDataConverter,
  DocumentData,
  SnapshotOptions,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

const idConverter: FirestoreDataConverter<any> = {
  toFirestore(data): DocumentData {
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

export type LocationDoc = {
  id?: string;
  name: string;
  country?: string;
  coordinates?: number[];
  image?: string;
};

export type UseLocationsParams = {
  searchString?: string;
};

export const useLocations = ({ searchString = "" }: UseLocationsParams) => {
  const db = getFirestore();
  const locationRef = collection(db, "locations").withConverter(
    idConverter
  ) as CollectionReference<LocationDoc>;

  const [locationsDocData, locationDocLoading] = useCollectionData<LocationDoc>(
    query(
      locationRef,
      where("name", ">=", searchString),
      where("name", "<=", searchString + "\uf8ff")
    )
  );

  const addLocation = async (data: LocationDoc) => {
    addDoc(locationRef, data);
  };

  const loading = locationDocLoading;

  return { locationsDocData, addLocation, loading };
};
