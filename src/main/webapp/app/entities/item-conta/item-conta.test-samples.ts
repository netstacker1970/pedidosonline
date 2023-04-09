import { IItemConta, NewItemConta } from './item-conta.model';

export const sampleWithRequiredData: IItemConta = {
  id: 12965,
};

export const sampleWithPartialData: IItemConta = {
  id: 96968,
  valorConta: 98501,
};

export const sampleWithFullData: IItemConta = {
  id: 67969,
  valorConta: 69075,
};

export const sampleWithNewData: NewItemConta = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
