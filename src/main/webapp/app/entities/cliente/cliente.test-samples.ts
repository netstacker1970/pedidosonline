import { ICliente, NewCliente } from './cliente.model';

export const sampleWithRequiredData: ICliente = {
  id: 45820,
};

export const sampleWithPartialData: ICliente = {
  id: 57246,
};

export const sampleWithFullData: ICliente = {
  id: 51849,
  nome: 'adapter Operations',
};

export const sampleWithNewData: NewCliente = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
