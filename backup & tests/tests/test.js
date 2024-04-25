// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const transport = require('../transport'); // Importa tu configuración de transporte de correo

// router.post(
//   "/register",
//   passport.authenticate("register", {
//     failurlRedirect: "/api/sessions/registerFail",
//   }),
//   async (req, res, next) => {
//     try {
//       // Aquí obtén el correo electrónico del usuario registrado
//       const userEmail = req.user.email; // Suponiendo que el email está almacenado en req.user.email

//       // Redirige a la ruta de prueba de correo electrónico y pasa el correo electrónico como parámetro
//       res.redirect(/api/mail/test-email?destination=${userEmail});
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// router.get("/test-email", async (req, res, next) => {
//   const destination = req.query.destination;

//   try {
//     await transport.sendMail({
//       from: Coder Test <${env_config.mailing.auth.user}>,
//       to: ${destination},
//       subject: Email de Prueba no hardcodeado,
//       html: Esto es un email de prueba,
//     });
//     res.send({ status: "success", message: "Email enviado con éxito" });
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;
