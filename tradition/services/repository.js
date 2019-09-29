const { Cookie } = require("../shared");

class Repository {
  constructor(cookies) {
    this.cookies = new Cookie(cookies);
  }

  getCookies = () => this.cookies.get();

  setCookies = cookies => this.cookies.save(cookies);

  clearCookies = () => this.cookies.clear();
}

module.exports = Repository;
