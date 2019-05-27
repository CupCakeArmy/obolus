const { createServer } = require('http')
const httpProxy = require('http-proxy')
const { parse } = require('url')
const next = require('next')
const axios = require('axios')

// Initialize globals
axios.defaults.validateStatus = status => status < 500

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const proxy = httpProxy.createProxyServer()
const target = dev
    ? `http://${process.env.API_HOST || 'api'}:5000`
    : 'http://api'

app.prepare().then(() => {

    createServer((req, res) => {
        const parsedUrl = parse(req.url, true)
        const { pathname } = parsedUrl

        if (pathname === '/sw.js')
            handle(req, res, parse('/static/sw.js', true))
        else if (pathname.startsWith('/api/'))
            proxy.web(req, res, { target }, error => console.log('Error!', error))
        else
            handle(req, res, parsedUrl)

    }).listen(80, err => {
        if (err) throw err
        console.log('> Frontend Ready 🚀')
    })

})
