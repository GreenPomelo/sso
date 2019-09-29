const axios = require("axios");
const Repository = require("./repository");

class yjsService {
  constructor(cookies = []) {
    this.repository = new yjsRepository(cookies);
  }

  init(cookies = []) {
    this.repository.cookies.save(cookies);
  }

  async login() {
    const location = await this.repository.getYjsTicket();
    await this.repository.getYjsCookie(location);
  }

  async getScore() {
    return await this.repository.getYjsScore();
  }

  async loginAndGetScore() {
    await this.login();
    return await this.getScore();
  }
}

class yjsRepository extends Repository {
  constructor(cookies) {
    super(cookies);
  }

  getYjsTicket = async () => {
    try {
      const { headers } = await axios.get(
        "http://rzfw.njupt.edu.cn/cas/login?service=http%3A%2F%2Fyjs.njupt.edu.cn%2Fepstar%2Fweb%2Fswms%2Fmainframe%2Fhome.jsp",
        {
          headers: { Cookie: this.cookies.getJoined() },
          maxRedirects: 0
        }
      );
      console.log(headers);
    } catch ({
      response: {
        headers: { location }
      }
    }) {
      return location;
    }
  };

  getYjsCookie = async location => {
    try {
      await axios.get(location, { maxRedirects: 0 });
    } catch ({ response: { headers } }) {
      this.cookies.clear();
      this.cookies.saveCookiesInHeader(headers);
    }
  };

  getYjsScore = async () => {
    try {
      const { data } = await axios.get(
        "http://yjs.njupt.edu.cn/epstar/app/template.jsp?mainobj=YJSXT/PYGL/CJGLST/V_PYGL_CJGL_KSCJHZB&tfile=KSCJHZB_CJCX_CD/KSCJHZB_XSCX_CD_BD&filter=V_PYGL_CJGL_KSCJHZB:WID=%275m3b6a53-8eg4kv-jxaat8b3-1-jxjugpju-1e4g%27",
        { headers: { Cookie: this.cookies.getJoined() }, maxRedirects: 0 }
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  };
}

module.exports = new yjsService();
