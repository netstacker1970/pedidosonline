import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICardapio, NewCardapio } from '../cardapio.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICardapio for edit and NewCardapioFormGroupInput for create.
 */
type CardapioFormGroupInput = ICardapio | PartialWithRequiredKeyOf<NewCardapio>;

type CardapioFormDefaults = Pick<NewCardapio, 'id'>;

type CardapioFormGroupContent = {
  id: FormControl<ICardapio['id'] | NewCardapio['id']>;
  dtCardapio: FormControl<ICardapio['dtCardapio']>;
};

export type CardapioFormGroup = FormGroup<CardapioFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CardapioFormService {
  createCardapioFormGroup(cardapio: CardapioFormGroupInput = { id: null }): CardapioFormGroup {
    const cardapioRawValue = {
      ...this.getFormDefaults(),
      ...cardapio,
    };
    return new FormGroup<CardapioFormGroupContent>({
      id: new FormControl(
        { value: cardapioRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dtCardapio: new FormControl(cardapioRawValue.dtCardapio),
    });
  }

  getCardapio(form: CardapioFormGroup): ICardapio | NewCardapio {
    return form.getRawValue() as ICardapio | NewCardapio;
  }

  resetForm(form: CardapioFormGroup, cardapio: CardapioFormGroupInput): void {
    const cardapioRawValue = { ...this.getFormDefaults(), ...cardapio };
    form.reset(
      {
        ...cardapioRawValue,
        id: { value: cardapioRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CardapioFormDefaults {
    return {
      id: null,
    };
  }
}
