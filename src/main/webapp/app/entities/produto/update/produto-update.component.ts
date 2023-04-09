import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProdutoFormService, ProdutoFormGroup } from './produto-form.service';
import { IProduto } from '../produto.model';
import { ProdutoService } from '../service/produto.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ICategoria } from 'app/entities/categoria/categoria.model';
import { CategoriaService } from 'app/entities/categoria/service/categoria.service';

@Component({
  selector: 'jhi-produto-update',
  templateUrl: './produto-update.component.html',
})
export class ProdutoUpdateComponent implements OnInit {
  isSaving = false;
  produto: IProduto | null = null;

  categoriasSharedCollection: ICategoria[] = [];

  editForm: ProdutoFormGroup = this.produtoFormService.createProdutoFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected produtoService: ProdutoService,
    protected produtoFormService: ProdutoFormService,
    protected categoriaService: CategoriaService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCategoria = (o1: ICategoria | null, o2: ICategoria | null): boolean => this.categoriaService.compareCategoria(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ produto }) => {
      this.produto = produto;
      if (produto) {
        this.updateForm(produto);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('pedidosOnlineApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const produto = this.produtoFormService.getProduto(this.editForm);
    if (produto.id !== null) {
      this.subscribeToSaveResponse(this.produtoService.update(produto));
    } else {
      this.subscribeToSaveResponse(this.produtoService.create(produto));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduto>>): void {
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

  protected updateForm(produto: IProduto): void {
    this.produto = produto;
    this.produtoFormService.resetForm(this.editForm, produto);

    this.categoriasSharedCollection = this.categoriaService.addCategoriaToCollectionIfMissing<ICategoria>(
      this.categoriasSharedCollection,
      produto.categoria
    );
  }

  protected loadRelationshipsOptions(): void {
    this.categoriaService
      .query()
      .pipe(map((res: HttpResponse<ICategoria[]>) => res.body ?? []))
      .pipe(
        map((categorias: ICategoria[]) =>
          this.categoriaService.addCategoriaToCollectionIfMissing<ICategoria>(categorias, this.produto?.categoria)
        )
      )
      .subscribe((categorias: ICategoria[]) => (this.categoriasSharedCollection = categorias));
  }
}
