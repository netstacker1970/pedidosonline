export interface ICliente {
  id: number;
  nome?: string | null;
}

export type NewCliente = Omit<ICliente, 'id'> & { id: null };
