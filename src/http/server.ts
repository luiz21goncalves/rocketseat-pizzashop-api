import { Elysia } from 'elysia'

import { ENV } from '../env'

const app = new Elysia().get('/', () => {
  return 'Hello World'
})

console.log(process.env.NODE_ENV)

app.listen(ENV.PORT,(server) => {
  console.log(`HTTP server running at: ${server.url}`)
} )