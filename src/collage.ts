import { Elysia, t } from "elysia";

import { ICat } from "./types";

const apiKey = process.env.API_KEY;
const authenticatedCatUrl = "https://api.thecatapi.com/v1/images/search?api_key=" + apiKey;
const breedUrl = "https://api.thecatapi.com/v1/breeds";
const catUrl = "https://api.thecatapi.com/v1/images/search";

const getBreeds = async () => {
  const response = await fetch(breedUrl);
  const breeds = await response.json();

  if (response.ok) {
    return breeds;
  }
};

const getCats = async ({ breeds, amount = 6 }: { breeds: [string], amount?: number }) => {
  console.log(`Fetching cat images 🐈 🐈 🐈` + "\n", catUrl + "&limit=" + amount + "&breed_ids=" + breeds);

  const searchQuery = "limit=" + amount + "&breed_ids=" + breeds

  const response = apiKey ? await fetch(authenticatedCatUrl + "&" + searchQuery) : await fetch(catUrl + "?" + searchQuery);
  const cats = await response.json();

  if (response.ok) {
    console.log(cats);

    // If there is no api key defined, the cat API always return 10 cats
    return cats.slice(0, amount);
  }
};

class Collage {
    constructor(public data: ICat[] = []) {}

    // I decided against forcing a collage to only be able to contain a cat once, some users of the backend might like to add some cats more than once.
    async add(breeds: [string], amount?: number) {
      const cats = await getCats({breeds, amount});
      console.log(`Adding ${cats.length} cats to the collage\n`, cats)

      cats.map((cat: ICat) => {
        this.data.push(cat);
      })

      return this.data;
    } 

    remove(index: number) {
      console.log(`Removing cat at index ${index} from the collage\n`)

      return this.data.splice(index, 1);
    } 

    update(index: number, cat: ICat) {
      console.log(`Updating cat at index ${index} in the collage, properties: ${JSON.stringify(cat)}\n`)

      return (this.data[index] = cat);
    } 
}

export const catCollage = new Elysia({ prefix: '/collage' })
// @ts-ignore; For some reason typescript was giving an error on the next line (Property 'decorate' does not exist on type 'Elysia'.), normally I would put more effort into fixing it, but I don't want to waste too much time right now
  .decorate('collage', new Collage())
  .onTransform(function log({ body, params, path, request: { method } }) {
    console.log(`${method} ${path}`, {
      body,
      params
    })
  })
  .get('/', ({ collage }) => collage.data)
  .get(
    '/:index',
    ({ collage, params: { index }, error }) => { 
      return collage.data[index] ?? error(404);
    },
    { 
      params: t.Object({ 
        index: t.Number() 
      }) 
    }
   )
  .post('/', async ({ collage, body: { breeds, amount }, error }) => {
    const listOfBreeds = await getBreeds()

    const breedIds = listOfBreeds.map((breedInfo: Object) => {
      return breedInfo.id;
    })

    let errorText = "";

    breeds.map((breed: string) => {
      if (!breedIds.includes(breed)) {
        if (errorText.length > 0) errorText += " "
        errorText += `Breed: "${breed}" does not exist.`
        // It seems I can't throw an error from a map?
        // const errorText = `Breed: "${breed}" does not exist`
        // return error(422, errorText)
      }
    })

    if (errorText.length > 0) {
      // Return an error explaining which breed/s do not exist in the cat API
      console.log(errorText + "\n")

      return error(422, errorText)
    } else {
      return collage.add(breeds, amount)
    };
    },
    {
    body: t.Object({
      breeds: t.Array(t.String()),
      amount: t.Optional(t.Number())
    }) 
  })
  .delete( 
    '/:index',
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
    '/:index',
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
