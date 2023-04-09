import dayjs from 'dayjs/esm';

export interface ICaixa {
  id: number;
  saldoinicio?: number | null;
  saldoFim?: number | null;
  dtAbertura?: dayjs.Dayjs | null;
  dtFechamento?: dayjs.Dayjs | null;
  valor?: number | null;
}

export type NewCaixa = Omit<ICaixa, 'id'> & { id: null };
