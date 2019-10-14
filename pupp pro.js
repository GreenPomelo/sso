const puppeteer = require("puppeteer");
const { performance } = require("perf_hooks");

const USER = {
  username: "",
  password: ""
};

const main = async () => {
  // DELETE
  return console.log(">>>>>>>> 先改个账号密码再来吧");

  const start = performance.now();
  // 首先通过Puppeteer启动一个浏览器环境,使用headless的要更快(比之前快1s左右)
  const browser = await puppeteer.launch({
    headless: true
  });

  try {
    const page = await browser.newPage();
    await page._client.send("Network.clearBrowserCookies");

    //设置拦截只加载需要的文件
    await page.setRequestInterception(true);
    page.on("request", request => {
      if (["image", "stylesheet", "font"].includes(request.resourceType())) {
        return request.abort();
      } else {
        request.continue();
      }
    });
    //log
    const on = ((performance.now() - start) / 1000).toFixed(2);
    console.log(`>>>>>>>>>>>>> ON ${on}s `);

    //去页面,waitUntil要改成domcontentloaded会快1s,不用等所有的资源文件都加载完
    await page.goto(
      "http://rzfw.njupt.edu.cn/cas/login?service=http%3A%2F%2F202.119.226.237%3A80%2F",
      {
        waitUntil: "domcontentloaded"
      }
    );
    //log
    const load = ((performance.now() - start) / 1000).toFixed(2);
    console.log(`>>>>>>>>>>>>> LOAD ${load}s | ${(load - on).toFixed(2)}s`);

    //登录然后等跳转
    await page.type("#username", USER.username);
    await page.type("#password", USER.password);
    await page.click("#dl");
    //log
    const login = ((performance.now() - start) / 1000).toFixed(2);
    console.log(`>>>>>>>>>>>>> LOGIN ${login}s | ${(login - load).toFixed(2)}`);

    //yjs数据获取
    await page.goto(
      "http://yjs.njupt.edu.cn/epstar/web/swms/mainframe/home.jsp",
      {
        waitUntil: "domcontentloaded"
      }
    );

    const cookies = await page.cookies();
    cookies.map(({ name, value }) => console.log(`>>>>>>> ${name} = ${value}`));

    //结束
    const fin = ((performance.now() - start) / 1000).toFixed(2);
    console.log(`>>>>>>>>>>>>> FIN ${fin}s | ${(fin - login).toFixed(2)}`);
  } catch (error) {
    console.log(error);
  } finally {
    if (browser) browser.close();
  }
};

(async () => {
  await main();
})();
