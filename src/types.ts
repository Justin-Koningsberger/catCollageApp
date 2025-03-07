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

export {ICollage, IPhoto};
