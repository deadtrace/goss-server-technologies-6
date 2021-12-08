const app = (express, bodyParser, createReadStream, crypto, http) => {
  const app = express();

  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,OPTIONS,DELETE"
    );
    res.set("Content-Type", "text/plain");
    next();
  });

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/login/", (req, res) => {
    res.send("deadtrace");
  });

  async function readCodeHandler(req, res) {
    const reader = createReadStream(import.meta.url.substring(7));
    let result = "";
    for await (const chunk of reader) result += chunk;
    res.send(result);
  }

  app.get("/code/", readCodeHandler);

  app.get("/sha1/:input/", (req, res) => {
    res.send(crypto.createHash("sha1").update(req.params.input).digest("hex"));
  });

  app.get("/req/", (req, res) => {
    const url = req.query.addr || req.body;
    let msg = "";
    if (url)
      http.get(
        url,
        { headers: { "Content-Type": "text/plain" } },
        (response) => {
          response.setEncoding("utf8");
          response.on("data", (chunk) => (msg += chunk));
          response.on("end", () => res.send(msg));
        }
      );
    else res.send("Не удалось получить данные по URL");
  });

  app.get("*", (req, res) => {
    res.send("deadtrace");
  });

  return app;
};

export default app;
