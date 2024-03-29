export const parseSwaggerJson = (swaggerJsonString: string) => {
  try {
    if (swaggerJsonString) {
      const swaggerObj: SwaggerDocument = JSON.parse(swaggerJsonString);
      // console.log(swaggerObj);
      return swaggerObj;
    }
  } catch (e) {
    console.error(e);
  }
};
