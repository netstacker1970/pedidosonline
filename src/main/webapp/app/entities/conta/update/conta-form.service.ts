import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IConta, NewConta } from '../conta.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IConta for edit and NewContaFormGroupInput for create.
 */
type ContaFormGroupInput = IConta | PartialWithRequiredKeyOf<NewConta>;

type ContaFormDefaults = Pick<NewConta, 'id'>;

type ContaFormGroupContent = {
  id: FormControl<IConta['id'] | NewConta['id']>;
  dtConta: FormControl<IConta['dtConta']>;
  valorConta: FormControl<IConta['valorConta']>;
  cliente: FormControl<IConta['cliente']>;
  caixa: FormControl<IConta['caixa']>;
};

export type ContaFormGroup = FormGroup<ContaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ContaFormService {
  createContaFormGroup(conta: ContaFormGroupInput = { id: null }): ContaFormGroup {
    const contaRawValue = {
      ...this.getFormDefaults(),
      ...conta,
    };
    return new FormGroup<ContaFormGroupContent>({
      id: new FormControl(
        { value: contaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dtConta: new FormControl(contaRawValue.dtConta),
      valorConta: new FormControl(contaRawValue.valorConta),
      cliente: new FormControl(contaRawValue.cliente),
      caixa: new FormControl(contaRawValue.caixa),
    });
  }

  getConta(form: ContaFormGroup): IConta | NewConta {
    return form.getRawValue() as IConta | NewConta;
  }

  resetForm(form: ContaFormGroup, conta: ContaFormGroupInput): void {
    const contaRawValue = { ...this.getFormDefaults(), ...conta };
    form.reset(
      {
        ...contaRawValue,
        id: { value: contaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ContaFormDefaults {
    return {
      id: null,
    };
  }
}
