import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CaixaFormService, CaixaFormGroup } from './caixa-form.service';
import { ICaixa } from '../caixa.model';
import { CaixaService } from '../service/caixa.service';

@Component({
  selector: 'jhi-caixa-update',
  templateUrl: './caixa-update.component.html',
})
export class CaixaUpdateComponent implements OnInit {
  isSaving = false;
  caixa: ICaixa | null = null;

  editForm: CaixaFormGroup = this.caixaFormService.createCaixaFormGroup();

  constructor(
    protected caixaService: CaixaService,
    protected caixaFormService: CaixaFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ caixa }) => {
      this.caixa = caixa;
      if (caixa) {
        this.updateForm(caixa);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const caixa = this.caixaFormService.getCaixa(this.editForm);
    if (caixa.id !== null) {
      this.subscribeToSaveResponse(this.caixaService.update(caixa));
    } else {
      this.subscribeToSaveResponse(this.caixaService.create(caixa));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICaixa>>): void {
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

  protected updateForm(caixa: ICaixa): void {
    this.caixa = caixa;
    this.caixaFormService.resetForm(this.editForm, caixa);
  }
}
