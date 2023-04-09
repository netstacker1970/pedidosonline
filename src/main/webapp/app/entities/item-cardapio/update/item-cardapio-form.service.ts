import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IItemCardapio, NewItemCardapio } from '../item-cardapio.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItemCardapio for edit and NewItemCardapioFormGroupInput for create.
 */
type ItemCardapioFormGroupInput = IItemCardapio | PartialWithRequiredKeyOf<NewItemCardapio>;

type ItemCardapioFormDefaults = Pick<NewItemCardapio, 'id'>;

type ItemCardapioFormGroupContent = {
  id: FormControl<IItemCardapio['id'] | NewItemCardapio['id']>;
  cardapio: FormControl<IItemCardapio['cardapio']>;
  produto: FormControl<IItemCardapio['produto']>;
};

export type ItemCardapioFormGroup = FormGroup<ItemCardapioFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItemCardapioFormService {
  createItemCardapioFormGroup(itemCardapio: ItemCardapioFormGroupInput = { id: null }): ItemCardapioFormGroup {
    const itemCardapioRawValue = {
      ...this.getFormDefaults(),
      ...itemCardapio,
    };
    return new FormGroup<ItemCardapioFormGroupContent>({
      id: new FormControl(
        { value: itemCardapioRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      cardapio: new FormControl(itemCardapioRawValue.cardapio),
      produto: new FormControl(itemCardapioRawValue.produto),
    });
  }

  getItemCardapio(form: ItemCardapioFormGroup): IItemCardapio | NewItemCardapio {
    return form.getRawValue() as IItemCardapio | NewItemCardapio;
  }

  resetForm(form: ItemCardapioFormGroup, itemCardapio: ItemCardapioFormGroupInput): void {
    const itemCardapioRawValue = { ...this.getFormDefaults(), ...itemCardapio };
    form.reset(
      {
        ...itemCardapioRawValue,
        id: { value: itemCardapioRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItemCardapioFormDefaults {
    return {
      id: null,
    };
  }
}
