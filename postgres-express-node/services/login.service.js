const jwt = require("jsonwebtoken");
const config = require("../config")

class LoginService {
  constructor({ logger, userModel }) {
    this.userModel = userModel;
    this.logger = logger;
  }

  async login({username, password}) {
    const userRecord = await this.userModel.findOne({
      where: {username},
    });

    if(!userRecord){
      this.logger.error("User not registered");
      throw new Error("Authentication failed");
    }

    this.logger.info("Checking password");
    if(userRecord.password === password){
      this.logger.info("Password correct, proceed and generate JWT");

      const user = {
        username: userRecord.username,
        role: userRecord.role || "guest",
      };

      const payload = {
        ...user,
        aud: config.jwt.audience || "localhost/api",
        iss: config.jwt.issuer || "localhost@fesb.hr",
      };

      const token = this.generateToken(payload);
      return {user, token};
    }
    this.logger.error("Password verification failed")
    throw new Error("Authentication failed")
  }
  generateToken(payload){
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }
}

module.exports = LoginService;