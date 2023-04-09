import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../cardapio.test-samples';

import { CardapioFormService } from './cardapio-form.service';

describe('Cardapio Form Service', () => {
  let service: CardapioFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardapioFormService);
  });

  describe('Service methods', () => {
    describe('createCardapioFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCardapioFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dtCardapio: expect.any(Object),
          })
        );
      });

      it('passing ICardapio should create a new form with FormGroup', () => {
        const formGroup = service.createCardapioFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dtCardapio: expect.any(Object),
          })
        );
      });
    });

    describe('getCardapio', () => {
      it('should return NewCardapio for default Cardapio initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCardapioFormGroup(sampleWithNewData);

        const cardapio = service.getCardapio(formGroup) as any;

        expect(cardapio).toMatchObject(sampleWithNewData);
      });

      it('should return NewCardapio for empty Cardapio initial value', () => {
        const formGroup = service.createCardapioFormGroup();

        const cardapio = service.getCardapio(formGroup) as any;

        expect(cardapio).toMatchObject({});
      });

      it('should return ICardapio', () => {
        const formGroup = service.createCardapioFormGroup(sampleWithRequiredData);

        const cardapio = service.getCardapio(formGroup) as any;

        expect(cardapio).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICardapio should not enable id FormControl', () => {
        const formGroup = service.createCardapioFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCardapio should disable id FormControl', () => {
        const formGroup = service.createCardapioFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
