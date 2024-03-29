export const safeParseJSON = (data: string): string | object => {
  try {
    const parsedJSON = JSON.parse(data);
    return parsedJSON;
  } catch (err) {
    return data;
  }
};
