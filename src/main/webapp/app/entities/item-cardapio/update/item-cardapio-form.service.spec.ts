import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../item-cardapio.test-samples';

import { ItemCardapioFormService } from './item-cardapio-form.service';

describe('ItemCardapio Form Service', () => {
  let service: ItemCardapioFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemCardapioFormService);
  });

  describe('Service methods', () => {
    describe('createItemCardapioFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createItemCardapioFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cardapio: expect.any(Object),
            produto: expect.any(Object),
          })
        );
      });

      it('passing IItemCardapio should create a new form with FormGroup', () => {
        const formGroup = service.createItemCardapioFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cardapio: expect.any(Object),
            produto: expect.any(Object),
          })
        );
      });
    });

    describe('getItemCardapio', () => {
      it('should return NewItemCardapio for default ItemCardapio initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createItemCardapioFormGroup(sampleWithNewData);

        const itemCardapio = service.getItemCardapio(formGroup) as any;

        expect(itemCardapio).toMatchObject(sampleWithNewData);
      });

      it('should return NewItemCardapio for empty ItemCardapio initial value', () => {
        const formGroup = service.createItemCardapioFormGroup();

        const itemCardapio = service.getItemCardapio(formGroup) as any;

        expect(itemCardapio).toMatchObject({});
      });

      it('should return IItemCardapio', () => {
        const formGroup = service.createItemCardapioFormGroup(sampleWithRequiredData);

        const itemCardapio = service.getItemCardapio(formGroup) as any;

        expect(itemCardapio).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IItemCardapio should not enable id FormControl', () => {
        const formGroup = service.createItemCardapioFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewItemCardapio should disable id FormControl', () => {
        const formGroup = service.createItemCardapioFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
