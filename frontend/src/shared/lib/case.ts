// Utility function to check if value is a plain object
const isPlainObject = (value: any): value is Record<string, any> => {
  return (
    value !== null && typeof value === "object" && value.constructor === Object
  );
};

export const toCamelCase = <T>(obj: any): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item)) as unknown as T;
  } else if (isPlainObject(obj)) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const camelKey = key.replace(/_([a-z])/g, (_, char) =>
        char.toUpperCase(),
      );
      acc[camelKey] = toCamelCase(value);
      return acc;
    }, {} as any);
  }
  return obj;
};

export const toSnakeCase = <T>(obj: any): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item)) as unknown as T;
  } else if (isPlainObject(obj)) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (char) => `_${char.toLowerCase()}`,
      );
      acc[snakeKey] = toSnakeCase(value);
      return acc;
    }, {} as any);
  }
  return obj;
};
