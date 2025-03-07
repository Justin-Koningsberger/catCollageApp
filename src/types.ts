interface ICat {
  id: string;
  // I feel like the image should be part of the cat interface itself
  url: string;
  width: number;
  height: number;
}

export { ICat };
