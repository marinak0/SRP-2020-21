class LoginService {
  constructor({ logger, userModel }) {
    this.userModel = userModel;
    this.logger = logger;
  }

  async getUser(userDTO) {
    const user = await this.userModel.findOne({
      // * to include only some attributes use:
      // * attributes: ["username", "id"]
      where: userDTO,
    });
    return user;
  }
}

module.exports = LoginService;