class Cookie {
  constructor(cookies = []) {
    this.cookies = this.save(cookies);
  }

  save = cookies => (this.cookies = cookies);

  saveCookiesInHeader = header =>
    (this.cookies = [
      ...this.cookies,
      ...header["set-cookie"].map(i => i.match(/(\w+)=([\w%":-]+)/)[0])
    ]);

  clear = () => (this.cookies = []);

  get = () => this.cookies;

  getJoined = () => this.cookies.join("; ");
}

module.exports = Cookie;
