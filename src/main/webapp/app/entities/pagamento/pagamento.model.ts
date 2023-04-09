import dayjs from 'dayjs/esm';
import { IConta } from 'app/entities/conta/conta.model';

export interface IPagamento {
  id: number;
  valor?: number | null;
  dtPagamento?: dayjs.Dayjs | null;
  conta?: Pick<IConta, 'id'> | null;
  cliente?: Pick<IConta, 'id'> | null;
}

export type NewPagamento = Omit<IPagamento, 'id'> & { id: null };
