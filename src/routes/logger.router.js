import { Router } from "express";
import { loggerMiddleware} from '../logger.js';

const router = Router();
// Pruebas de distintos niveles
router.get('/', loggerMiddleware,(req, res) => {
    req.logger.debug('Error de nivel DEBUG');
    req.logger.http('Error de nivel HTTP');
    req.logger.info('Error de nivel INFO');
    req.logger.warning('Error de  nivel WARNING');
    req.logger.error('Error de nivel ERROR');
    req.logger.fatal('Error de  nivel FATAL');
    res.send('Pruebas en la consola o archivo de registro');
  });
  
export default router;