export const removeEmptyFields = (obj: Record<string, any>): any => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });
  return newObj;
};

export const removeZeroFields = (obj: Record<string, any>): any => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === 0) {
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

export const getObjectFieldsCount = (obj: Record<string, any>) => {
  let count = 0;
  for (let _key in obj) {
    count += 1;
  }
  return count;
};
