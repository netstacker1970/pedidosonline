import dayjs from 'dayjs/esm';
import { ICategoria } from 'app/entities/categoria/categoria.model';

export interface IProduto {
  id: number;
  produto?: dayjs.Dayjs | null;
  image?: string | null;
  imageContentType?: string | null;
  categoria?: Pick<ICategoria, 'id'> | null;
}

export type NewProduto = Omit<IProduto, 'id'> & { id: null };
