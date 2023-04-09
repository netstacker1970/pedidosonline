import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ItemCardapioFormService, ItemCardapioFormGroup } from './item-cardapio-form.service';
import { IItemCardapio } from '../item-cardapio.model';
import { ItemCardapioService } from '../service/item-cardapio.service';
import { ICardapio } from 'app/entities/cardapio/cardapio.model';
import { CardapioService } from 'app/entities/cardapio/service/cardapio.service';
import { IProduto } from 'app/entities/produto/produto.model';
import { ProdutoService } from 'app/entities/produto/service/produto.service';

@Component({
  selector: 'jhi-item-cardapio-update',
  templateUrl: './item-cardapio-update.component.html',
})
export class ItemCardapioUpdateComponent implements OnInit {
  isSaving = false;
  itemCardapio: IItemCardapio | null = null;

  cardapiosSharedCollection: ICardapio[] = [];
  produtosSharedCollection: IProduto[] = [];

  editForm: ItemCardapioFormGroup = this.itemCardapioFormService.createItemCardapioFormGroup();

  constructor(
    protected itemCardapioService: ItemCardapioService,
    protected itemCardapioFormService: ItemCardapioFormService,
    protected cardapioService: CardapioService,
    protected produtoService: ProdutoService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCardapio = (o1: ICardapio | null, o2: ICardapio | null): boolean => this.cardapioService.compareCardapio(o1, o2);

  compareProduto = (o1: IProduto | null, o2: IProduto | null): boolean => this.produtoService.compareProduto(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemCardapio }) => {
      this.itemCardapio = itemCardapio;
      if (itemCardapio) {
        this.updateForm(itemCardapio);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const itemCardapio = this.itemCardapioFormService.getItemCardapio(this.editForm);
    if (itemCardapio.id !== null) {
      this.subscribeToSaveResponse(this.itemCardapioService.update(itemCardapio));
    } else {
      this.subscribeToSaveResponse(this.itemCardapioService.create(itemCardapio));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItemCardapio>>): void {
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

  protected updateForm(itemCardapio: IItemCardapio): void {
    this.itemCardapio = itemCardapio;
    this.itemCardapioFormService.resetForm(this.editForm, itemCardapio);

    this.cardapiosSharedCollection = this.cardapioService.addCardapioToCollectionIfMissing<ICardapio>(
      this.cardapiosSharedCollection,
      itemCardapio.cardapio
    );
    this.produtosSharedCollection = this.produtoService.addProdutoToCollectionIfMissing<IProduto>(
      this.produtosSharedCollection,
      itemCardapio.produto
    );
  }

  protected loadRelationshipsOptions(): void {
    this.cardapioService
      .query()
      .pipe(map((res: HttpResponse<ICardapio[]>) => res.body ?? []))
      .pipe(
        map((cardapios: ICardapio[]) =>
          this.cardapioService.addCardapioToCollectionIfMissing<ICardapio>(cardapios, this.itemCardapio?.cardapio)
        )
      )
      .subscribe((cardapios: ICardapio[]) => (this.cardapiosSharedCollection = cardapios));

    this.produtoService
      .query()
      .pipe(map((res: HttpResponse<IProduto[]>) => res.body ?? []))
      .pipe(
        map((produtos: IProduto[]) => this.produtoService.addProdutoToCollectionIfMissing<IProduto>(produtos, this.itemCardapio?.produto))
      )
      .subscribe((produtos: IProduto[]) => (this.produtosSharedCollection = produtos));
  }
}
