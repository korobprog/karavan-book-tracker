import { createStore, createEvent } from "effector";

export const isOnlineChanged = createEvent<boolean>();
export const $isOnline = createStore(false);

$isOnline.on(isOnlineChanged, (_state, value) => value);
