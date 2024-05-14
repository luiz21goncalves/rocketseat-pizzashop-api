import { Elysia } from 'elysia'

const app = new Elysia().get('/', () => {
  return 'Hello World'
})

app.listen(process.env.PORT,(server) => {
  console.log(`HTTP server running at: ${server.url}`)
} )