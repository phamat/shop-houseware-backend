const express = require("express")
const dotenv = require('dotenv')
const { default: mongoose } = require("mongoose")
const routes = require('./routes')
const cors = require('cors')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const { createProxyMiddleware } = require('http-proxy-middleware')

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json({ limit: '50mb' }))
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

routes(app)

app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/': '/'
  },
}))

mongoose.connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log('Connect Db Success!')
  })
  .catch((err) => {
    console.log(err)
  })

app.listen(port, () => {
  console.log('Server is running in port: ', port)
})