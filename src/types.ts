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

interface ICat {
  id: string;
  url: string;
  width: number;
  height: number;
}

export { ICollage, IPhoto, ICat };
