import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../caixa.test-samples';

import { CaixaFormService } from './caixa-form.service';

describe('Caixa Form Service', () => {
  let service: CaixaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaixaFormService);
  });

  describe('Service methods', () => {
    describe('createCaixaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCaixaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            saldoinicio: expect.any(Object),
            saldoFim: expect.any(Object),
            dtAbertura: expect.any(Object),
            dtFechamento: expect.any(Object),
            valor: expect.any(Object),
          })
        );
      });

      it('passing ICaixa should create a new form with FormGroup', () => {
        const formGroup = service.createCaixaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            saldoinicio: expect.any(Object),
            saldoFim: expect.any(Object),
            dtAbertura: expect.any(Object),
            dtFechamento: expect.any(Object),
            valor: expect.any(Object),
          })
        );
      });
    });

    describe('getCaixa', () => {
      it('should return NewCaixa for default Caixa initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCaixaFormGroup(sampleWithNewData);

        const caixa = service.getCaixa(formGroup) as any;

        expect(caixa).toMatchObject(sampleWithNewData);
      });

      it('should return NewCaixa for empty Caixa initial value', () => {
        const formGroup = service.createCaixaFormGroup();

        const caixa = service.getCaixa(formGroup) as any;

        expect(caixa).toMatchObject({});
      });

      it('should return ICaixa', () => {
        const formGroup = service.createCaixaFormGroup(sampleWithRequiredData);

        const caixa = service.getCaixa(formGroup) as any;

        expect(caixa).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICaixa should not enable id FormControl', () => {
        const formGroup = service.createCaixaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCaixa should disable id FormControl', () => {
        const formGroup = service.createCaixaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
