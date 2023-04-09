import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../item-conta.test-samples';

import { ItemContaFormService } from './item-conta-form.service';

describe('ItemConta Form Service', () => {
  let service: ItemContaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemContaFormService);
  });

  describe('Service methods', () => {
    describe('createItemContaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItemContaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            valorConta: expect.any(Object),
            produto: expect.any(Object),
            itemCardapio: expect.any(Object),
            conta: expect.any(Object),
          })
        );
      });

      it('passing IItemConta should create a new form with FormGroup', () => {
        const formGroup = service.createItemContaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            valorConta: expect.any(Object),
            produto: expect.any(Object),
            itemCardapio: expect.any(Object),
            conta: expect.any(Object),
          })
        );
      });
    });

    describe('getItemConta', () => {
      it('should return NewItemConta for default ItemConta initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createItemContaFormGroup(sampleWithNewData);

        const itemConta = service.getItemConta(formGroup) as any;

        expect(itemConta).toMatchObject(sampleWithNewData);
      });

      it('should return NewItemConta for empty ItemConta initial value', () => {
        const formGroup = service.createItemContaFormGroup();

        const itemConta = service.getItemConta(formGroup) as any;

        expect(itemConta).toMatchObject({});
      });

      it('should return IItemConta', () => {
        const formGroup = service.createItemContaFormGroup(sampleWithRequiredData);

        const itemConta = service.getItemConta(formGroup) as any;

        expect(itemConta).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItemConta should not enable id FormControl', () => {
        const formGroup = service.createItemContaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItemConta should disable id FormControl', () => {
        const formGroup = service.createItemContaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
