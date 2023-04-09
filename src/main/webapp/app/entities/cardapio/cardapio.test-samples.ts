import dayjs from 'dayjs/esm';

import { ICardapio, NewCardapio } from './cardapio.model';

export const sampleWithRequiredData: ICardapio = {
  id: 26438,
};

export const sampleWithPartialData: ICardapio = {
  id: 26835,
};

export const sampleWithFullData: ICardapio = {
  id: 8499,
  dtCardapio: dayjs('2023-04-09'),
};

export const sampleWithNewData: NewCardapio = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
