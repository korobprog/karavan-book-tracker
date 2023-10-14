export const removeEmptyFields = (obj: Record<string, any>): any => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });
  return newObj;
};

export const calcObjectFields = <Obj extends Record<string, any>>(
  prev: Obj = {} as Obj,
  operator: "+" | "-",
  next: Obj = {} as Obj
): Obj => {
  const result = { ...prev } as Record<string, any>;
  for (const key in next) {
    if (operator === "+") result[key] = (result[key] || 0) + (next[key] || 0);
    if (operator === "-") result[key] = (result[key] || 0) - (next[key] || 0);
  }
  return result as Obj;
};
