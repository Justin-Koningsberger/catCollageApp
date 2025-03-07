interface ICollage {
  id?: number;
  name: string;
  description: string;
  photos: IPhoto[];
}

interface IPhoto {
  id?: number;
  url: string;
}

interface Cat {
  id: string;
  url: string;
  width: number;
  height: number;
}

export { ICollage, IPhoto, Cat };
