import dayjs from 'dayjs/esm';

export interface ICardapio {
  id: number;
  dtCardapio?: dayjs.Dayjs | null;
}

export type NewCardapio = Omit<ICardapio, 'id'> & { id: null };
