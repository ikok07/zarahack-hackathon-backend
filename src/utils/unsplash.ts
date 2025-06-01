import { createApi } from "unsplash-js";

export class Unsplash {
  static serverApi = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY!
  });

  static async searchPhotos(query: string) {
    const res = await this.serverApi.search.getPhotos({
      query
    })

    return res.response?.results.map(r => r.urls);
  }
}