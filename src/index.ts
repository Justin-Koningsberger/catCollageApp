import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { catCollage } from "./collage"

// import { ICollage, IPhoto, ICat } from "./types"

const app = new Elysia()
// @ts-ignore; For some reason get typescript was giving an error on the next line (Property 'use' does not exist on type 'Elysia'.), normally I would put more effort into fixing it, but I don't want to waste too much time right now
  .use(swagger())
  .use(catCollage)
  .get("/", () => "Hello Elysia")
  .listen(3000);


const url = app.server?.hostname + ":" + app.server?.port

console.log(
  `Elysia is running at ${url}, Swagger is running at ${url}/swagger,\ngo to ${url}/cats to see some furry friends`
);

export {};
