import dayjs from 'dayjs/esm';

import { ICaixa, NewCaixa } from './caixa.model';

export const sampleWithRequiredData: ICaixa = {
  id: 4181,
};

export const sampleWithPartialData: ICaixa = {
  id: 66958,
  saldoinicio: 47015,
  saldoFim: 50979,
};

export const sampleWithFullData: ICaixa = {
  id: 54046,
  saldoinicio: 94215,
  saldoFim: 47394,
  dtAbertura: dayjs('2023-04-09'),
  dtFechamento: dayjs('2023-04-09'),
  valor: 69698,
};

export const sampleWithNewData: NewCaixa = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
