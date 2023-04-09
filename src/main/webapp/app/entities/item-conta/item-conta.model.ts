import { IProduto } from 'app/entities/produto/produto.model';
import { IItemCardapio } from 'app/entities/item-cardapio/item-cardapio.model';
import { IConta } from 'app/entities/conta/conta.model';

export interface IItemConta {
  id: number;
  valorConta?: number | null;
  produto?: Pick<IProduto, 'id'> | null;
  itemCardapio?: Pick<IItemCardapio, 'id'> | null;
  conta?: Pick<IConta, 'id'> | null;
}

export type NewItemConta = Omit<IItemConta, 'id'> & { id: null };
