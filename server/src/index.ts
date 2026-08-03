import dotenv = require("dotenv");
import appModule = require("./app.js");
import configModule = require("./config.js");

dotenv.config();

const config = configModule.loadConfig();
const app = appModule.createApp(config);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
