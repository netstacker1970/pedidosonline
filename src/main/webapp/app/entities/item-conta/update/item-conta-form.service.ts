import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IItemConta, NewItemConta } from '../item-conta.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItemConta for edit and NewItemContaFormGroupInput for create.
 */
type ItemContaFormGroupInput = IItemConta | PartialWithRequiredKeyOf<NewItemConta>;

type ItemContaFormDefaults = Pick<NewItemConta, 'id'>;

type ItemContaFormGroupContent = {
  id: FormControl<IItemConta['id'] | NewItemConta['id']>;
  valorConta: FormControl<IItemConta['valorConta']>;
  produto: FormControl<IItemConta['produto']>;
  itemCardapio: FormControl<IItemConta['itemCardapio']>;
  conta: FormControl<IItemConta['conta']>;
};

export type ItemContaFormGroup = FormGroup<ItemContaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItemContaFormService {
  createItemContaFormGroup(itemConta: ItemContaFormGroupInput = { id: null }): ItemContaFormGroup {
    const itemContaRawValue = {
      ...this.getFormDefaults(),
      ...itemConta,
    };
    return new FormGroup<ItemContaFormGroupContent>({
      id: new FormControl(
        { value: itemContaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      valorConta: new FormControl(itemContaRawValue.valorConta),
      produto: new FormControl(itemContaRawValue.produto),
      itemCardapio: new FormControl(itemContaRawValue.itemCardapio),
      conta: new FormControl(itemContaRawValue.conta),
    });
  }

  getItemConta(form: ItemContaFormGroup): IItemConta | NewItemConta {
    return form.getRawValue() as IItemConta | NewItemConta;
  }

  resetForm(form: ItemContaFormGroup, itemConta: ItemContaFormGroupInput): void {
    const itemContaRawValue = { ...this.getFormDefaults(), ...itemConta };
    form.reset(
      {
        ...itemContaRawValue,
        id: { value: itemContaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItemContaFormDefaults {
    return {
      id: null,
    };
  }
}
