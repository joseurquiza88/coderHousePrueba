import { Router } from "express";
// Renderizamos
// Ruta para crear cuenta
const router = Router();

router.get("", (req, res) => {
  res.render("signup", {
    title: "Crear cuenta",
  });
});
export default router;