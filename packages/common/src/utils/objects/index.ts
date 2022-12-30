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
  prev: Obj,
  operator: "+" | "-",
  next: Obj
): Obj => {
  const result = { ...prev } as Record<string, any>;
  for (const key in result) {
    if (operator === "+") result[key] += next[key] || 0;
    if (operator === "-") result[key] -= next[key] || 0;
  }
  return result as Obj;
};
