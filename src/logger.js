import winston from 'winston';

// niveles de registro
const levels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  };
  
  // colores para los niveles de registro
  winston.addColors({
    debug: 'blue',
    http: 'green',
    info: 'cyan',
    warning: 'yellow',
    error: 'red',
    fatal: 'magenta',
  });
  
  //  transporte para guardar los registros en un archivo "error.log"
  const errorTransport = new winston.transports.File({
    filename: './error.log',
    level: 'error', 
  });
  
  // Configuracion del logger de desarrollo
  const devLogger = winston.createLogger({
    levels,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    transports: [new winston.transports.Console({ level: 'debug' })], 
  });
  
  // Configuracion del logger de producción
  const prodLogger = winston.createLogger({
    levels,
    format: winston.format.simple(),
    transports: [errorTransport], 
  });
  

  // Configuracion del logger
const loggerMiddleware = (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      req.logger = prodLogger;
    } else {
      req.logger = devLogger;
    }
    next();
  };
  export { devLogger, prodLogger,loggerMiddleware };