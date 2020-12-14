const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //modul za generiranje tokena
const config = require("../config");

//definira se klasa LoginService
class LoginService {
  constructor({ logger, userModel }) {
    this.userModel = userModel;
    this.logger = logger;
  }

  
  //nadi korisnika koji ima dani username i spremi objekt u userRecord
  async login({username, password}){
    const userRecord =await this.userModel.findOne({
      where: {username},
    });

    //ako navedeni korisnik nije pronaden
    if(!userRecord){
      this.logger.error("User not registered"); //biljezenje u logu da je bezuspjesna prijava
      throw new Error("Authentification failed");
    }

    //ako korisnik postoji
    this.logger.info("Checking password"); 
    const validPassword = await bcrypt.compare(password, userRecord.password);

    //if(userRecord.password === password)  nesigurna usporedba
    if(validPassword){
      this.logger.info("Password correct, proceed and generate JWT"); //biljezenje u logu uspjesnu autentifikaciju

      const user ={
        username: userRecord.username,
        role: userRecord.role || "guest",
      };

      const payload = {
        ...user,
        aud: config.jwt.audience || "localhost/api", //za koga je namjenjen token
        iss: config.jwt.issuer || "localhost@fesb", // tko je izdao token

      };
      //stvaranje tokena
      const token = this.generateToken(payload); 

      return{user,token}; 
    }

    //ako lozinka nije tocna
    this.logger.error("Invalid password");
    throw new Error("Authentification failed");
  }

  //funckoija za generiranje tokena
  generateToken(payload){
    //potpisivanje payloada
    return jwt.sign(payload, config.jwt.secret,{
      expiresIn: config.jwt.expiresIn,
    });
  }

}

module.exports = LoginService;