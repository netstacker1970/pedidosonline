export interface ICategoria {
  id: number;
  categoria?: string | null;
}

export type NewCategoria = Omit<ICategoria, 'id'> & { id: null };
