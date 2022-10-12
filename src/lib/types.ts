export interface IList {
  id: string;
  name: string;
  board: string;
  cards: ICard[];
  created_at: string;
  order: number;
}

export interface ICard {
  id: string;
  name: string;
  description: string;
  list: string;
  created_at: string;
  order: number;
}
