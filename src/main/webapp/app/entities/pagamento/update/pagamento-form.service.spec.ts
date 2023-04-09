import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../pagamento.test-samples';

import { PagamentoFormService } from './pagamento-form.service';

describe('Pagamento Form Service', () => {
  let service: PagamentoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagamentoFormService);
  });

  describe('Service methods', () => {
    describe('createPagamentoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPagamentoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            valor: expect.any(Object),
            dtPagamento: expect.any(Object),
            conta: expect.any(Object),
            cliente: expect.any(Object),
          })
        );
      });

      it('passing IPagamento should create a new form with FormGroup', () => {
        const formGroup = service.createPagamentoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            valor: expect.any(Object),
            dtPagamento: expect.any(Object),
            conta: expect.any(Object),
            cliente: expect.any(Object),
          })
        );
      });
    });

    describe('getPagamento', () => {
      it('should return NewPagamento for default Pagamento initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPagamentoFormGroup(sampleWithNewData);

        const pagamento = service.getPagamento(formGroup) as any;

        expect(pagamento).toMatchObject(sampleWithNewData);
      });

      it('should return NewPagamento for empty Pagamento initial value', () => {
        const formGroup = service.createPagamentoFormGroup();

        const pagamento = service.getPagamento(formGroup) as any;

        expect(pagamento).toMatchObject({});
      });

      it('should return IPagamento', () => {
        const formGroup = service.createPagamentoFormGroup(sampleWithRequiredData);

        const pagamento = service.getPagamento(formGroup) as any;

        expect(pagamento).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPagamento should not enable id FormControl', () => {
        const formGroup = service.createPagamentoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPagamento should disable id FormControl', () => {
        const formGroup = service.createPagamentoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
