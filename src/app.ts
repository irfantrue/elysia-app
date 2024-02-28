import { html } from '@elysiajs/html'
import staticPlugin from '@elysiajs/static'
import { Database } from 'config/database'
import { Elysia } from 'elysia'
import { CompressionMiddleware } from 'middlewares/compression'
import { ErrorMiddleware } from 'middlewares/errors'
import { LoggingMiddleware } from 'middlewares/logging'
import { IndexRoutes } from 'routes'
import { WebSocket } from 'websocket'

const app = new Elysia()

// Database.connect()

app.use(staticPlugin())
app.use(html())
app.use(new ErrorMiddleware().handle())
app.use(new CompressionMiddleware().handle())
app.use(new LoggingMiddleware().handle())
app.use(new IndexRoutes().handle())
app.use(new WebSocket().handle())

app.listen(process.env['PORT'] ?? 8000)
console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
