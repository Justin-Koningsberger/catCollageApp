import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { catCollage } from "./collage"

const app = new Elysia()
// @ts-ignore; For some reason typescript was giving an error on the next line (Property 'use' does not exist on type 'Elysia'.), normally I would put more effort into fixing it, but I don't want to waste too much time right now
  .use(swagger())
  .use(catCollage)
  .listen(3000);


const url = app.server?.hostname + ":" + app.server?.port;

console.log(
  `Swagger is running at ${url}/swagger,\ngo to ${url}/collage to see some furry friends\n`
);

export {};
