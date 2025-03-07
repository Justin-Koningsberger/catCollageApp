import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { catCollage } from "./collage"

import { ICollage, IPhoto, Cat } from "./types"

const apiKey = process.env.API_KEY;
const catUrl = "https://api.thecatapi.com/v1/images";
const authenticatedCatUrl = "https://api.thecatapi.com/v1/images?api_key=" + apiKey;
const testUrl = "https://api.thecatapi.com/v1/images/search?limit=10";

// TODO: default to 6 cats per collage
const postCatCollage = async (breed: string, amount: number) => {
  // Never trust input
  return [];
};

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
