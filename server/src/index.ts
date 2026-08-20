import 'dotenv/config'
import { createApp } from './app'
import { loadConfig } from './config'

const config = loadConfig()
const app = createApp(config)

app.listen(config.port, () => {
  console.log(`BZ Resources forms API listening on http://localhost:${config.port}`)
})
