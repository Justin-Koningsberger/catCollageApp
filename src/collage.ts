import { Elysia, t } from "elysia";

import { Cat } from "./types";

const apiKey = process.env.API_KEY;
const catUrl = "https://api.thecatapi.com/v1/images";
const authenticatedCatUrl = "https://api.thecatapi.com/v1/images?api_key=" + apiKey;
const testUrl = "https://api.thecatapi.com/v1/images/search?limit=10";

const getCats = async () => {
  console.log(`Fetching cat images 🐈 🐈 🐈`);
  // I don't think we need authentication, because we don't need more than 10 images at a time from thecatapi.com
  // const response = apiKey ? await fetch(authenticatedCatUrl) : await fetch(catUrl);
  const response = await fetch(testUrl);
  const cats = await response.json();

  if (response.ok) {
    // const leftColumn: Cat[] = [];
    // const rightColumn: Cat[] = [];

    // cats.forEach((cat: Cat, i: number) => {
    //   if (i % 2 === 0) {
    //     leftColumn.push(cat);
    //   } else {
    //     rightColumn.push(cat);
    //   }
    // });

    return cats;
  }
};

class Collage {
  // TODO: start with empry list of cats
    constructor(public data: Cat[] = [
      {id: "12k", url: "https://cdn2.thecatapi.com/images/12k.jpg", width: 250, height: 250}
    ]) {}

    async add(cat: Cat) {
      const cats = await getCats();
      this.data.push(cat) 

      return this.data 
    } 

    remove(index: number) {
      return this.data.splice(index, 1) 
    } 

    update(index: number, cat: Cat) {
      return (this.data[index] = cat) 
    } 
}

export const catCollage = new Elysia()
// @ts-ignore; For some reason get typescript was giving an error on the next line (Property 'decorate' does not exist on type 'Elysia'.), normally I would put more effort into fixing it, but I don't want to waste too much time right now
  .decorate('collage', new Collage())
  // .get("/collage", () => getCatCollage())
  // .post('/collage', (breed: string, amount: number) => postCatCollage(breed, amount))
  .get('/collage', ({ collage }) => collage.data)
  .get(
    '/collage/:index', 
    ({ collage, params: { index }, error }) => { 
      return collage.data[index] ?? error(404);
    },
    { 
      params: t.Object({ 
        index: t.Number() 
      }) 
    }
   )
  .put('/note', ({ collage, body: { data } }) => collage.add(data), { 
    body: t.Object({ 
      data: t.String() 
    }) 
  }) 
