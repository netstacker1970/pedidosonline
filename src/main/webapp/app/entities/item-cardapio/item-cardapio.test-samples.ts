import { IItemCardapio, NewItemCardapio } from './item-cardapio.model';

export const sampleWithRequiredData: IItemCardapio = {
  id: 41806,
};

export const sampleWithPartialData: IItemCardapio = {
  id: 33325,
};

export const sampleWithFullData: IItemCardapio = {
  id: 26869,
};

export const sampleWithNewData: NewItemCardapio = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
