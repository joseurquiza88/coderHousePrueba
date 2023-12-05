//Manejo de errores, temario nuevo
//Segun profe
import EErrors from "../../service/enum.js";

export default (error, req, res, next) => {
  console.log(error);
  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      res.send({
        status: "error",
        error: error.name,
      });
      break;
    case EErrors.DATABASE_ERROR:
      res.send({
        status: "error",
        error: error.name,
      });
      break;
    case EErrors.ROUTING_ERROR:
      res.send({
        status: "error",
        error: error.name,
      });
      break;
    default:
      res.send({
        status: "error",
        error: "unhandled error",
      });
      break;
  }
};