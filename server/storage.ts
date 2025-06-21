// Legacy storage - use new modular storage from storage/index.ts
import { storage as storageInstance, Storage as StorageClass, legacyStorage as legacy, type IStorage as IStorageType } from "./storage/index";

export const storage = storageInstance;
export default storageInstance;
export const Storage = StorageClass;
export const legacyStorage = legacy;
export type IStorage = IStorageType;