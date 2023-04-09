import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPagamento, NewPagamento } from '../pagamento.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPagamento for edit and NewPagamentoFormGroupInput for create.
 */
type PagamentoFormGroupInput = IPagamento | PartialWithRequiredKeyOf<NewPagamento>;

type PagamentoFormDefaults = Pick<NewPagamento, 'id'>;

type PagamentoFormGroupContent = {
  id: FormControl<IPagamento['id'] | NewPagamento['id']>;
  valor: FormControl<IPagamento['valor']>;
  dtPagamento: FormControl<IPagamento['dtPagamento']>;
  conta: FormControl<IPagamento['conta']>;
  cliente: FormControl<IPagamento['cliente']>;
};

export type PagamentoFormGroup = FormGroup<PagamentoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PagamentoFormService {
  createPagamentoFormGroup(pagamento: PagamentoFormGroupInput = { id: null }): PagamentoFormGroup {
    const pagamentoRawValue = {
      ...this.getFormDefaults(),
      ...pagamento,
    };
    return new FormGroup<PagamentoFormGroupContent>({
      id: new FormControl(
        { value: pagamentoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      valor: new FormControl(pagamentoRawValue.valor),
      dtPagamento: new FormControl(pagamentoRawValue.dtPagamento),
      conta: new FormControl(pagamentoRawValue.conta),
      cliente: new FormControl(pagamentoRawValue.cliente),
    });
  }

  getPagamento(form: PagamentoFormGroup): IPagamento | NewPagamento {
    return form.getRawValue() as IPagamento | NewPagamento;
  }

  resetForm(form: PagamentoFormGroup, pagamento: PagamentoFormGroupInput): void {
    const pagamentoRawValue = { ...this.getFormDefaults(), ...pagamento };
    form.reset(
      {
        ...pagamentoRawValue,
        id: { value: pagamentoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PagamentoFormDefaults {
    return {
      id: null,
    };
  }
}
