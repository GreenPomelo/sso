const axios = require("axios");
const Repository = require("./repository");
const RSAUtils = require("../shared/rsa");

class ssoService {
  constructor(cookies = []) {
    this.repository = new ssoRepository(cookies);
  }

  init(cookies = []) {
    this.repository.cookies.save(cookies);
  }

  async login(user) {
    const execution = await this.repository.getExecution();
    const publicKey = await this.repository.getPublicKey();
    const password = await this.repository.getEncryptedPassword(
      publicKey,
      user.password
    );
    await this.repository.getSsoCookie({
      username: user.username,
      password,
      execution
    });
    return this.repository.getCookies();
  }
}

class ssoRepository extends Repository {
  constructor(cookies) {
    super(cookies);
  }

  getExecution = async () => {
    try {
      const { headers, data } = await axios.get(
        "http://rzfw.njupt.edu.cn/cas/login?service=http%3A%2F%2F202.119.226.237%3A80%2F"
      );
      this.cookies.saveCookiesInHeader(headers);
      const execution = /execution" value="(.*)"/.exec(data)[1];
      return execution;
    } catch (error) {
      console.error(error);
    }
  };

  getPublicKey = async () => {
    try {
      const { headers, data: publicKey } = await axios.get(
        "http://rzfw.njupt.edu.cn/cas/v2/getPubKey",
        { headers: { Cookie: this.cookies.getJoined() } }
      );
      this.cookies.saveCookiesInHeader(headers);
      return publicKey;
    } catch (error) {
      console.error(error);
    }
  };

  getEncryptedPassword = ({ exponent, modulus }, password) => {
    const keyPair = RSAUtils.getKeyPair(exponent, "", modulus);
    const encryptedPassword = RSAUtils.encryptedString(
      keyPair,
      password
        .split("")
        .reverse()
        .join("")
    );
    return encryptedPassword;
  };

  getSsoCookie = async ({ username, password, execution }) => {
    try {
      await axios.post(
        "http://rzfw.njupt.edu.cn/cas/login?service=http%3A%2F%2F202.119.226.237%3A80%2F",
        formatData({
          username,
          password,
          execution,
          authcode: "",
          _eventId: "submit"
        }),
        {
          headers: { Cookie: this.cookies.getJoined() },
          maxRedirects: 0
        }
      );
    } catch ({ response: { headers } }) {
      this.cookies.saveCookiesInHeader(headers);
    }
  };
}

const formatData = data =>
  Object.entries(data)
    .reduce((acc, [key, value]) => `${acc}${key}=${value}&`, "")
    .slice(0, -1);

module.exports = new ssoService();
