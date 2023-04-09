import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ContaFormService, ContaFormGroup } from './conta-form.service';
import { IConta } from '../conta.model';
import { ContaService } from '../service/conta.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { ICaixa } from 'app/entities/caixa/caixa.model';
import { CaixaService } from 'app/entities/caixa/service/caixa.service';

@Component({
  selector: 'jhi-conta-update',
  templateUrl: './conta-update.component.html',
})
export class ContaUpdateComponent implements OnInit {
  isSaving = false;
  conta: IConta | null = null;

  clientesSharedCollection: ICliente[] = [];
  caixasSharedCollection: ICaixa[] = [];

  editForm: ContaFormGroup = this.contaFormService.createContaFormGroup();

  constructor(
    protected contaService: ContaService,
    protected contaFormService: ContaFormService,
    protected clienteService: ClienteService,
    protected caixaService: CaixaService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCliente = (o1: ICliente | null, o2: ICliente | null): boolean => this.clienteService.compareCliente(o1, o2);

  compareCaixa = (o1: ICaixa | null, o2: ICaixa | null): boolean => this.caixaService.compareCaixa(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ conta }) => {
      this.conta = conta;
      if (conta) {
        this.updateForm(conta);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const conta = this.contaFormService.getConta(this.editForm);
    if (conta.id !== null) {
      this.subscribeToSaveResponse(this.contaService.update(conta));
    } else {
      this.subscribeToSaveResponse(this.contaService.create(conta));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConta>>): void {
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

  protected updateForm(conta: IConta): void {
    this.conta = conta;
    this.contaFormService.resetForm(this.editForm, conta);

    this.clientesSharedCollection = this.clienteService.addClienteToCollectionIfMissing<ICliente>(
      this.clientesSharedCollection,
      conta.cliente
    );
    this.caixasSharedCollection = this.caixaService.addCaixaToCollectionIfMissing<ICaixa>(this.caixasSharedCollection, conta.caixa);
  }

  protected loadRelationshipsOptions(): void {
    this.clienteService
      .query()
      .pipe(map((res: HttpResponse<ICliente[]>) => res.body ?? []))
      .pipe(map((clientes: ICliente[]) => this.clienteService.addClienteToCollectionIfMissing<ICliente>(clientes, this.conta?.cliente)))
      .subscribe((clientes: ICliente[]) => (this.clientesSharedCollection = clientes));

    this.caixaService
      .query()
      .pipe(map((res: HttpResponse<ICaixa[]>) => res.body ?? []))
      .pipe(map((caixas: ICaixa[]) => this.caixaService.addCaixaToCollectionIfMissing<ICaixa>(caixas, this.conta?.caixa)))
      .subscribe((caixas: ICaixa[]) => (this.caixasSharedCollection = caixas));
  }
}
