export type HashMap<ObjectType extends any> = Record<string, ObjectType>;

export const getHashMap = <ObjectType extends Record<string, any>>(
  objects: ObjectType[],
  key = "id"
) => {
  return objects.reduce((acc, element) => {
    const accKey = element[key];
    acc[accKey] = element;
    return acc;
  }, {} as HashMap<ObjectType>);
};
