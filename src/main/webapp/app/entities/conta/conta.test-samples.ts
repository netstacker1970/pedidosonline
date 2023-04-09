import dayjs from 'dayjs/esm';

import { IConta, NewConta } from './conta.model';

export const sampleWithRequiredData: IConta = {
  id: 17789,
};

export const sampleWithPartialData: IConta = {
  id: 11281,
  dtConta: dayjs('2023-04-09'),
  valorConta: 75470,
};

export const sampleWithFullData: IConta = {
  id: 93805,
  dtConta: dayjs('2023-04-08'),
  valorConta: 6212,
};

export const sampleWithNewData: NewConta = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
