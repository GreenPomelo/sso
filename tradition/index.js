const { performance } = require("perf_hooks");
const { ssoService, yjsService } = require("./services");

const USER = {
  username: "10191027",
  password: ""
};

const main = async () => {
  // DELETE
  return console.log(">>>>>>>> 先改个账号密码再来吧");

  const start = performance.now();

  ssoService.init();
  const cookies = await ssoService.login(USER);

  yjsService.init(cookies);
  const data = await yjsService.loginAndGetScore();

  log(start);
};

const log = start => {
  console.log(
    `>>>>>>>>> 天呐！只花了 ${((performance.now() - start) / 1000).toFixed(
      2
    )}s 就拿到了姨的成绩。`
  );
};

(async () => {
  for (let i = 0; i < 10; i++) {
    await main();
  }
})();
