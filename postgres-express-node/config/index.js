const dotenv = require("dotenv");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

/**
 * Express app config
 */
module.exports = {
  port: process.env.PORT,

  // For winston and morgan loggers
  logs: {
    winston: {
      level: process.env.LOG_LEVEL || "debug",
    },
    morgan: {
      format: process.env.MORGAN_FORMAT || "combined",
    },
  },

  api: {
    prefix: "/api",
  },
  //ovo sadrzi JWT token
  jwt:{
    //konfiguracijski parametri
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_DURATION || "1h",
    algorithms: ["HS256"], //algoritam za potpisivanje tokena
    exclude :{ // da bi se mogli ukljuciti na path, da ne trazi token za druge path-ove
      path:[
        {
          url:"/api/login",
          methods:["POST"],
        },
      ],
    },
  },
  bcrypt:{
    SALT_ROUNDS:12,
  },
};