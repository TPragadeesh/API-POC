interface SwaggerDocument {
  swagger?: string;
  openapi?: string;
  info?: SwaggerInfo;
  host?: string;
  basePath?: string;
  schemes?: string[];
  consumes?: string[];
  produces?: string[];
  paths?: SwaggerPath;
  definitions?: SwaggerDefinition;
}

interface SwaggerInfo {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: {
    name?: string;
    email?: string;
    url?: string;
  };
  license?: {
    name?: string;
    url?: string;
  };
}

interface SwaggerPath {
  [path: string]: {
    [method: string]: SwaggerOperation;
  };
}

interface SwaggerOperation {
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  parameters?: SwaggerParameter[];
  responses?: {
    [statusCode: string]: SwaggerResponse;
  };
}

interface SwaggerParameter {
  name: string;
  in: "query" | "header" | "path" | "formData" | "body";
  description?: string;
  required?: boolean;
  type?: string;
}

interface SwaggerResponse {
  description?: string;
  schema?: {
    type?: string;
  };
}

interface SwaggerDefinition {
  [definition: string]: {
    type: string;
    properties?: {
      [property: string]: {
        type?: string;
      };
    };
  };
}
