import * as storage from "./localStorage";

const storageKey = "adminDefaultBookLang";

export const setDefaultBookLang = (lang?: string) => {
  if (lang) {
    storage.local.setItem(storageKey, lang);
  } else {
    storage.local.removeItem(storageKey);
  }
};

export const getDefaultBookLang = () => {
  return storage.local.getItem(storageKey);
};
