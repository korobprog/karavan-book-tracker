import { storageFactory } from "storage-factory";

export const local = storageFactory(() => localStorage);