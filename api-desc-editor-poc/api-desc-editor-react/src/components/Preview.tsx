import { Badge } from "@chakra-ui/react";
import useFileStore from "../store/useFileStore";
import { parseSwaggerJson } from "../utilities/swaggerJsonParser";

const Preview = () => {
  const { updatedContent } = useFileStore();

  const data = parseSwaggerJson(updatedContent);

  const paths = data?.paths;
  let pathObjects = undefined;

  if (paths) {
    pathObjects = Object.entries(paths).map(([path, methods]) => ({
      path,
      methods: Object.entries(methods).map(([method, operation]) => ({
        method,
        operation,
      })),
    }));
  }

  //console.log(pathObjects);

  const getBackgroundColor = (method: string): string => {
    switch (method.toLowerCase()) {
      case "get":
        return "#BFEA6C";
      case "delete":
        return "#F39A95";
      default:
        return "#F7CA73";
    }
  };

  return (
    <div className="preview-content">
      <div className="header-section">
        <h3>{data && data.info && data.info.title}</h3>
        <div className="header-tags">
          {
            <Badge
              colorScheme="#F7CA73"
              fontSize="14px"
              paddingX={2}
              marginRight="5px"
              borderRadius="4px"
            >
              {data && "REST"}
            </Badge>
          }
          {
            <Badge
              colorScheme="#F7CA73"
              fontSize="14px"
              paddingX={2}
              marginRight="5px"
              borderRadius="4px"
            >
              {data && data.info && data.info.version}
            </Badge>
          }
          {data?.swagger && (
            <Badge
              colorScheme="#F7CA73"
              fontSize="14px"
              paddingX={2}
              marginRight="5px"
              borderRadius="4px"
            >
              {"Swagger " + data.swagger}
            </Badge>
          )}
          {data?.openapi && (
            <Badge
              colorScheme="#F7CA73"
              fontSize="14px"
              paddingX={2}
              marginRight="5px"
              borderRadius="4px"
            >
              {"OPEN API " + data.openapi}
            </Badge>
          )}
        </div>
      </div>
      <div className="header-description">
        <p>{data && data.info && data.info.description}</p>
      </div>
      <div className="paths-section">
        {pathObjects &&
          pathObjects.map((pathObject, index) => (
            <div key={index}>
              <h3>{pathObject.path}</h3>
              <ul>
                {pathObject.methods.map((methodObject, methodIndex) => (
                  <li key={methodIndex}>
                    <p
                      style={{
                        backgroundColor: getBackgroundColor(
                          methodObject.method
                        ),
                        padding: "5px",
                        marginLeft: "5px",
                        marginTop: "10px",
                        borderRadius: "5px",
                        fontWeight: "500",
                        width: "fit-content",
                      }}
                    >
                      {methodObject.method.toUpperCase()}
                    </p>
                    <p>{methodObject.operation.summary}</p>
                    <p>{methodObject.operation.description}</p>
                  </li>
                ))}
              </ul>
              <div
                style={{ border: "1px solid #D2D9E0", margin: "0.5rem 0" }}
              ></div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Preview;
