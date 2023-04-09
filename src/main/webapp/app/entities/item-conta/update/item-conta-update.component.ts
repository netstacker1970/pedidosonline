import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ItemContaFormService, ItemContaFormGroup } from './item-conta-form.service';
import { IItemConta } from '../item-conta.model';
import { ItemContaService } from '../service/item-conta.service';
import { IProduto } from 'app/entities/produto/produto.model';
import { ProdutoService } from 'app/entities/produto/service/produto.service';
import { IItemCardapio } from 'app/entities/item-cardapio/item-cardapio.model';
import { ItemCardapioService } from 'app/entities/item-cardapio/service/item-cardapio.service';
import { IConta } from 'app/entities/conta/conta.model';
import { ContaService } from 'app/entities/conta/service/conta.service';

@Component({
  selector: 'jhi-item-conta-update',
  templateUrl: './item-conta-update.component.html',
})
export class ItemContaUpdateComponent implements OnInit {
  isSaving = false;
  itemConta: IItemConta | null = null;

  produtosSharedCollection: IProduto[] = [];
  itemCardapiosSharedCollection: IItemCardapio[] = [];
  contasSharedCollection: IConta[] = [];

  editForm: ItemContaFormGroup = this.itemContaFormService.createItemContaFormGroup();

  constructor(
    protected itemContaService: ItemContaService,
    protected itemContaFormService: ItemContaFormService,
    protected produtoService: ProdutoService,
    protected itemCardapioService: ItemCardapioService,
    protected contaService: ContaService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProduto = (o1: IProduto | null, o2: IProduto | null): boolean => this.produtoService.compareProduto(o1, o2);

  compareItemCardapio = (o1: IItemCardapio | null, o2: IItemCardapio | null): boolean =>
    this.itemCardapioService.compareItemCardapio(o1, o2);

  compareConta = (o1: IConta | null, o2: IConta | null): boolean => this.contaService.compareConta(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemConta }) => {
      this.itemConta = itemConta;
      if (itemConta) {
        this.updateForm(itemConta);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itemConta = this.itemContaFormService.getItemConta(this.editForm);
    if (itemConta.id !== null) {
      this.subscribeToSaveResponse(this.itemContaService.update(itemConta));
    } else {
      this.subscribeToSaveResponse(this.itemContaService.create(itemConta));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItemConta>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(itemConta: IItemConta): void {
    this.itemConta = itemConta;
    this.itemContaFormService.resetForm(this.editForm, itemConta);

    this.produtosSharedCollection = this.produtoService.addProdutoToCollectionIfMissing<IProduto>(
      this.produtosSharedCollection,
      itemConta.produto
    );
    this.itemCardapiosSharedCollection = this.itemCardapioService.addItemCardapioToCollectionIfMissing<IItemCardapio>(
      this.itemCardapiosSharedCollection,
      itemConta.itemCardapio
    );
    this.contasSharedCollection = this.contaService.addContaToCollectionIfMissing<IConta>(this.contasSharedCollection, itemConta.conta);
  }

  protected loadRelationshipsOptions(): void {
    this.produtoService
      .query()
      .pipe(map((res: HttpResponse<IProduto[]>) => res.body ?? []))
      .pipe(map((produtos: IProduto[]) => this.produtoService.addProdutoToCollectionIfMissing<IProduto>(produtos, this.itemConta?.produto)))
      .subscribe((produtos: IProduto[]) => (this.produtosSharedCollection = produtos));

    this.itemCardapioService
      .query()
      .pipe(map((res: HttpResponse<IItemCardapio[]>) => res.body ?? []))
      .pipe(
        map((itemCardapios: IItemCardapio[]) =>
          this.itemCardapioService.addItemCardapioToCollectionIfMissing<IItemCardapio>(itemCardapios, this.itemConta?.itemCardapio)
        )
      )
      .subscribe((itemCardapios: IItemCardapio[]) => (this.itemCardapiosSharedCollection = itemCardapios));

    this.contaService
      .query()
      .pipe(map((res: HttpResponse<IConta[]>) => res.body ?? []))
      .pipe(map((contas: IConta[]) => this.contaService.addContaToCollectionIfMissing<IConta>(contas, this.itemConta?.conta)))
      .subscribe((contas: IConta[]) => (this.contasSharedCollection = contas));
  }
}
