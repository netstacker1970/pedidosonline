import { ICardapio } from 'app/entities/cardapio/cardapio.model';
import { IProduto } from 'app/entities/produto/produto.model';

export interface IItemCardapio {
  id: number;
  cardapio?: Pick<ICardapio, 'id'> | null;
  produto?: Pick<IProduto, 'id'> | null;
}

export type NewItemCardapio = Omit<IItemCardapio, 'id'> & { id: null };
