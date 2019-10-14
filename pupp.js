const puppeteer = require("puppeteer");
const { performance } = require("perf_hooks");

const USER = {
  username: "10191027",
  password: ""
};

const main = async () => {
  // DELETE
  return console.log(">>>>>>>> 先改个账号密码再来吧");

  const start = performance.now();
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === "dev" ? false : true,
    ignoreHTTPSErrors: true,
    args: [
      "--disable-web-security",
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-zygote",
      "--disable-popup-blocking"
    ]
  });

  const page = await browser.newPage();
  await page._client.send("Network.clearBrowserCookies");
  await page.setRequestInterception(true);
  page.on("request", request => {
    if (["image", "stylesheet", "font"].includes(request.resourceType())) {
      return request.abort();
    }
    request.continue();
  });

  await page.goto(
    "http://rzfw.njupt.edu.cn/cas/login?service=http%3A%2F%2F202.119.226.237%3A80%2F",
    {
      waitUntil: "networkidle0"
    }
  );
  console.log(">>>>>>>>> my load", performance.now() - start);
  await page.type("#username", USER.username);
  await page.type("#password", USER.password);
  await page.click("#dl");
  await page.waitForNavigation({ waitUntil: "domcontentloaded" });
  console.log(">>>>>>>>> LOGIN", performance.now() - start);

  await page.goto("http://yjs.njupt.edu.cn/epstar/web/swms/mainframe/home.jsp");
  console.log(">>>>>>>>> YJS", performance.now() - start);
  const cookies = await page.cookies();
  cookies.map(({ name, value }) => console.log(`>>>>>>> ${name} = ${value}`));

  console.log(">>>>>>>>>>>>> FIN", performance.now() - start, "\n\n\n");
};

main();
