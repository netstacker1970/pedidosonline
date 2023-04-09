import dayjs from 'dayjs/esm';

import { IPagamento, NewPagamento } from './pagamento.model';

export const sampleWithRequiredData: IPagamento = {
  id: 91007,
};

export const sampleWithPartialData: IPagamento = {
  id: 60236,
  valor: 25326,
  dtPagamento: dayjs('2023-04-09'),
};

export const sampleWithFullData: IPagamento = {
  id: 99628,
  valor: 58183,
  dtPagamento: dayjs('2023-04-09'),
};

export const sampleWithNewData: NewPagamento = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
