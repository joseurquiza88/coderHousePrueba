//Librerias utilizadas
import local from "passport-local";
import passport from "passport";
import * as dotenv from "dotenv";
import jwt, { ExtractJwt } from "passport-jwt";
import GitHubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utils.js";
import UserModel from "../dao/models/user.model.js";
//config dotenv para variables de entorno
dotenv.config();

//Estrategias
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
//Datos para conectarse a github que provienen del .env
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

//Configuracion de la cookies, codigo segun profe
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["CoderKeyQueNadieDebeSaber"];
  }
  return token;
};

//Paasport
const initializePassport = () => {
// estrategia jwt
  passport.use("jwt",
     new JWTStrategy({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: "CoderKeyQueNadieDebeSaber"
    },
    async (jwt_payload, done) => {
      try {
        //vemos si el usuario exista en la base de datos
           let response = await UserModel.find({
            email: jwt_payload.user.username,
           });
           //console.log("respuesta desde jwt",response)
           if (!response) {
            return done(null, false, { message: "Usuario no encontrado" });
          }
          else {
            return done(null, jwt_payload);
           }
         } catch (error) {
           done(error);
         }
       }
     )
   );
 
//Estrategia de registro con github
  passport.use( "github",
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        //console.log(profile)
        try {
          let user = await UserModel.findOne({
            email: profile?.emails[0]?.value,
          })
          if (!user) {
            const newUser = {
              first_name: profile.displayName.split(" ")[0],
              last_name: profile.displayName.split(" ")[1],
              email: profile?.emails[0]?.value,
              age: 18,
              password: crypto.randomBytes(20).toString("hex"),
            };
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
    //Estrategia para el registro
    passport.use("register", new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await UserModel.findOne({ email: username });
          console.log("user", user);
          if (user) {
            return done(null, false, { message: "Usuario exitente"});
          }
          const newUser = {first_name, last_name, age, email, last_connection: null, password: createHash(password)}
          console.log("Nuevo usuario", newUser);
          let result = await UserModel.create(newUser);
            return done(null, result);
          } catch (error) {
            return done("Error al crear el nuevo usuario", error);
          }
        }
      )
    );
 
    //Estrategia para el login - Local
    passport.use(
        "login",
        new LocalStrategy(
            async ( username, password, done) => {
            try {
              const user = await UserModel.findOne({ email : username});
              if (!user) {
                console.log("Usuario inexistente")
                return done(null, false, { message: "Usuario no encontrado" });
              }
                if (!isValidPassword(user.password, password)) {
                return done(null, false, { message: "Contraseña incorrecta" });
              } else {
                // Guardar en la base de datos la informacion sobre la ultima conexion del usuario
                user.last_connection = new Date();
                await user.save();
                return done(null, user);
              }
            } catch (error) {
                return done("Error al obtener el usuario", error);
            }
          }
        )
      );
      //Configuracion para Serializar - unSerializar
      passport.serializeUser((user, done) => {
        done(null, user._id);
      });
      passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id);
        done(null, user);
      });
    
    }
  export default initializePassport;