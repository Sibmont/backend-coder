import EErrors from "../../config/enums.js";

export default (error, req, res, next) => {
  switch (error.code) {
    case EErrors.ROUTING_ERROR:
      res.status(404).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
    case EErrors.INVALID_TYPE_ERROR:
      res.status(400).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
    case EErrors.RESOURCE_NOT_FOUND:
      res.status(404).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
    case EErrors.AUTHORIZATION_ERROR:
      res.status(403).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
    case EErrors.INTERNAL_SERVER_ERROR:
      res.status(500).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
    case EErrors.DATABASE_ERROR:
      res.status(503).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
    default:
      res.status(500).send({
        status: "error",
        error: error.name,
        description: error.cause,
      });
  }

  next();
};
