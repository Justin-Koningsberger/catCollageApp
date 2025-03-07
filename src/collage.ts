import { Elysia, t } from "elysia";

import { ICat } from "./types";

const apiKey = process.env.API_KEY;
const catUrl = "https://api.thecatapi.com/v1/images/search";
const authenticatedCatUrl = "https://api.thecatapi.com/v1/images?api_key=" + apiKey;
const testUrl = "https://api.thecatapi.com/v1/images/search?limit=10";

const getCats = async (breed: string, amount: number = 6) => {
  console.log(`Fetching cat images 🐈 🐈 🐈`);
  // I don't think we need authentication, because we don't need more than 10 images at a time from thecatapi.com
  // const response = apiKey ? await fetch(authenticatedCatUrl) : await fetch(catUrl);
  const response = await fetch(catUrl + "?limit=" + amount + "&breed_ids=" + breed);
  const cats = await response.json();

  if (response.ok) {
    console.log(cats);

    return cats;
  }
};

class Collage {
    constructor(public data: ICat[] = []) {}

    // TODO: find a way of making the id unique, and prevent adding cats to a collage twice
    async add(breed: string, amount?: number) {
      const cats = await getCats(breed, amount);

      cat => this.data.push(cats);

      return this.data;
    } 

    remove(index: number) {
      return this.data.splice(index, 1);
    } 

    update(index: number, cat: ICat) {
      return (this.data[index] = cat);
    } 
}

export const catCollage = new Elysia()
// @ts-ignore; For some reason get typescript was giving an error on the next line (Property 'decorate' does not exist on type 'Elysia'.), normally I would put more effort into fixing it, but I don't want to waste too much time right now
  .decorate('collage', new Collage())
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
  .post('/collage', ({ collage, body: { breed, amount } }) => collage.add(breed, amount), { 
    body: t.Object({ 
      breed: t.String(),
      amount: t.Optional(t.Number())
    }) 
  })
  .delete( 
    '/collage/:index', 
    ({ collage, params: { index }, error }) => { 
      if (index in collage.data) return collage.remove(index) 

      return error(422) 
    }, 
    { 
      params: t.Object({ 
        index: t.Number() 
      }) 
    } 
  )
  .patch( 
    '/collage/:index', 
    ({ collage, params: { index }, body: { data }, error }) => { 
      if (index in collage.data) return collage.update(index, data) 

      return error(422) 
    }, 
    { 
      params: t.Object({ 
        index: t.Number() 
      }), 
      body: t.Object({ 
        data: t.Object({
          id: t.String(),
          url: t.String(),
          width: t.Number(),
          height: t.Number()
        })
      }) 
    } 
  ) 
