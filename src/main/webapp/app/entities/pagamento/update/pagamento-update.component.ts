import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PagamentoFormService, PagamentoFormGroup } from './pagamento-form.service';
import { IPagamento } from '../pagamento.model';
import { PagamentoService } from '../service/pagamento.service';
import { IConta } from 'app/entities/conta/conta.model';
import { ContaService } from 'app/entities/conta/service/conta.service';

@Component({
  selector: 'jhi-pagamento-update',
  templateUrl: './pagamento-update.component.html',
})
export class PagamentoUpdateComponent implements OnInit {
  isSaving = false;
  pagamento: IPagamento | null = null;

  contasSharedCollection: IConta[] = [];

  editForm: PagamentoFormGroup = this.pagamentoFormService.createPagamentoFormGroup();

  constructor(
    protected pagamentoService: PagamentoService,
    protected pagamentoFormService: PagamentoFormService,
    protected contaService: ContaService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareConta = (o1: IConta | null, o2: IConta | null): boolean => this.contaService.compareConta(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pagamento }) => {
      this.pagamento = pagamento;
      if (pagamento) {
        this.updateForm(pagamento);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pagamento = this.pagamentoFormService.getPagamento(this.editForm);
    if (pagamento.id !== null) {
      this.subscribeToSaveResponse(this.pagamentoService.update(pagamento));
    } else {
      this.subscribeToSaveResponse(this.pagamentoService.create(pagamento));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPagamento>>): void {
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

  protected updateForm(pagamento: IPagamento): void {
    this.pagamento = pagamento;
    this.pagamentoFormService.resetForm(this.editForm, pagamento);

    this.contasSharedCollection = this.contaService.addContaToCollectionIfMissing<IConta>(
      this.contasSharedCollection,
      pagamento.conta,
      pagamento.cliente
    );
  }

  protected loadRelationshipsOptions(): void {
    this.contaService
      .query()
      .pipe(map((res: HttpResponse<IConta[]>) => res.body ?? []))
      .pipe(
        map((contas: IConta[]) =>
          this.contaService.addContaToCollectionIfMissing<IConta>(contas, this.pagamento?.conta, this.pagamento?.cliente)
        )
      )
      .subscribe((contas: IConta[]) => (this.contasSharedCollection = contas));
  }
}
