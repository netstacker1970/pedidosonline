import dayjs from 'dayjs/esm';

import { IProduto, NewProduto } from './produto.model';

export const sampleWithRequiredData: IProduto = {
  id: 79836,
};

export const sampleWithPartialData: IProduto = {
  id: 27537,
  produto: dayjs('2023-04-09'),
};

export const sampleWithFullData: IProduto = {
  id: 34427,
  produto: dayjs('2023-04-09'),
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
};

export const sampleWithNewData: NewProduto = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
