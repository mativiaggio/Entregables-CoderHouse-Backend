const { Router } = require("express");
const env_config = require("../config/config");
const nodemailer = require("nodemailer");
const router = Router();

// Mailer
const transport = nodemailer.createTransport({
  service: env_config.mailing.emailService,
  port: env_config.mailing.emailPort,
  auth: {
    user: env_config.mailing.auth.emailUser,
    pass: env_config.mailing.auth.emailPassword,
  },
});

router.get("/test-email", async (req, res) => {
  const destination = req.query.destination;

  try {
    await transport.sendMail({
      from: `Coder Test <${env_config.mailing.auth.user}>`,
      to: `${destination}`,
      subject: `Email de Prueba no hardcodeado`,
      html: `Esto es un email de prueba`,
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.get("/successfully-registered", async (req, res) => {
  const destination = req.query.destination;

  try {
    await transport.sendMail({
      from: `Coder Test <${env_config.mailing.auth.user}>`,
      to: `${destination}`,
      subject: `¡Usuario registrado con éxito!`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
              integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
              crossorigin="anonymous"
            />
          </head>
          <body>
            <div class="container-fluid">
              <div class="row">
                <div
                  class="col-12 gx-0"
                  style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <img
                    src="${__dirname}/public/public/assets/logos/main-logo.png"
                    alt=""
                  />
                  <h3>¡Usuario registrado con éxito!</h3>
                  <p>
                    Te queremos contar que tu usuario ha sido registrado con éxito, ya
                    podes comprar todo lo que quieras en nuestra web
                  </p>
                </div>
              </div>
            </div>

            <script
              src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
              integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
              crossorigin="anonymous"
            ></script>
            <script
              src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js"
              integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
              crossorigin="anonymous"
            ></script>
            <script
              src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js"
              integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
              crossorigin="anonymous"
            ></script>
          </body>
        </html>

      
      `,
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.get("/successfully-login", async (req, res) => {
  const destination = req.query.destination;
  const userfirstname = req.query.firstname;
  const userlastname = req.query.lastname;

  try {
    await transport.sendMail({
      from: `Coder Test <${env_config.mailing.auth.user}>`,
      to: `${destination}`,
      subject: `¡Usuario logueado con éxito!`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
              integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
              crossorigin="anonymous"
            />
          </head>
          <body>
            <div class="container-fluid">
              <div class="row">
                <div
                  class="col-12 gx-0"
                  style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <h3>¡Usuario registrado con éxito!</h3>
                </div>
                <div
                  class="col-12 gx-0"
                  style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <p>
                    Hola ${userfirstname} ${userlastname}!
                    Te queremos contar que tu usuario ha sido logueado con éxito, ya
                    podes comprar todo lo que quieras en nuestra web
                  </p>
                </div>

              </div>
            </div>

            <script
              src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
              integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
              crossorigin="anonymous"
            ></script>
            <script
              src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js"
              integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
              crossorigin="anonymous"
            ></script>
            <script
              src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js"
              integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
              crossorigin="anonymous"
            ></script>
          </body>
        </html>

      
      `,
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

module.exports = router;
