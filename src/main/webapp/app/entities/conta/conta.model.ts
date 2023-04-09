import dayjs from 'dayjs/esm';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ICaixa } from 'app/entities/caixa/caixa.model';

export interface IConta {
  id: number;
  dtConta?: dayjs.Dayjs | null;
  valorConta?: number | null;
  cliente?: Pick<ICliente, 'id'> | null;
  caixa?: Pick<ICaixa, 'id'> | null;
}

export type NewConta = Omit<IConta, 'id'> & { id: null };
