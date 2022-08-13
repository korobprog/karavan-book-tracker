import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

export const idConverter: FirestoreDataConverter<any> = {
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

type DocWithIdType = {
  id?: string;
}

export const mapDocsToHashTable = <DocType extends DocWithIdType = DocWithIdType>(locations: DocType[]) => {
  return locations.reduce((acc, doc) => {
    if (doc.id) {
      acc[doc.id] = doc;
    }
    return acc;
  }, {} as Record<string, DocType>);
};
