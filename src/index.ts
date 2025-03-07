import { Elysia } from "elysia";
import {ICollage, IPhoto} from "./types"

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

console.log(
  `Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

const catCollageApp = async () => {
  const apiKey = process.env.API_KEY;
  const catUrl = "https://api.thecatapi.com/v1/images";
  const authenticatedCatUrl = "https://api.thecatapi.com/v1/images?api_key=" + "";
  const testUrl = "https://api.thecatapi.com/v1/images/search?limit=10";

  // Never trust input
  console.log(`Fetching cat images 🐈 🐈 🐈`);
  // const response = apiKey ? await fetch(authenticatedCatUrl) : await fetch(catUrl);
  const response = await fetch(testUrl);

  if (response.ok) {
    console.log(await response.json());
  }
};

// To keep things simple, and so I can use-top level await:
catCollageApp();

export {};
