import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProduto, NewProduto } from '../produto.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProduto for edit and NewProdutoFormGroupInput for create.
 */
type ProdutoFormGroupInput = IProduto | PartialWithRequiredKeyOf<NewProduto>;

type ProdutoFormDefaults = Pick<NewProduto, 'id'>;

type ProdutoFormGroupContent = {
  id: FormControl<IProduto['id'] | NewProduto['id']>;
  produto: FormControl<IProduto['produto']>;
  image: FormControl<IProduto['image']>;
  imageContentType: FormControl<IProduto['imageContentType']>;
  categoria: FormControl<IProduto['categoria']>;
};

export type ProdutoFormGroup = FormGroup<ProdutoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProdutoFormService {
  createProdutoFormGroup(produto: ProdutoFormGroupInput = { id: null }): ProdutoFormGroup {
    const produtoRawValue = {
      ...this.getFormDefaults(),
      ...produto,
    };
    return new FormGroup<ProdutoFormGroupContent>({
      id: new FormControl(
        { value: produtoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      produto: new FormControl(produtoRawValue.produto),
      image: new FormControl(produtoRawValue.image),
      imageContentType: new FormControl(produtoRawValue.imageContentType),
      categoria: new FormControl(produtoRawValue.categoria),
    });
  }

  getProduto(form: ProdutoFormGroup): IProduto | NewProduto {
    return form.getRawValue() as IProduto | NewProduto;
  }

  resetForm(form: ProdutoFormGroup, produto: ProdutoFormGroupInput): void {
    const produtoRawValue = { ...this.getFormDefaults(), ...produto };
    form.reset(
      {
        ...produtoRawValue,
        id: { value: produtoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProdutoFormDefaults {
    return {
      id: null,
    };
  }
}
