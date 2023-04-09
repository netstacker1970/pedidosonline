import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CardapioFormService, CardapioFormGroup } from './cardapio-form.service';
import { ICardapio } from '../cardapio.model';
import { CardapioService } from '../service/cardapio.service';

@Component({
  selector: 'jhi-cardapio-update',
  templateUrl: './cardapio-update.component.html',
})
export class CardapioUpdateComponent implements OnInit {
  isSaving = false;
  cardapio: ICardapio | null = null;

  editForm: CardapioFormGroup = this.cardapioFormService.createCardapioFormGroup();

  constructor(
    protected cardapioService: CardapioService,
    protected cardapioFormService: CardapioFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cardapio }) => {
      this.cardapio = cardapio;
      if (cardapio) {
        this.updateForm(cardapio);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cardapio = this.cardapioFormService.getCardapio(this.editForm);
    if (cardapio.id !== null) {
      this.subscribeToSaveResponse(this.cardapioService.update(cardapio));
    } else {
      this.subscribeToSaveResponse(this.cardapioService.create(cardapio));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICardapio>>): void {
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

  protected updateForm(cardapio: ICardapio): void {
    this.cardapio = cardapio;
    this.cardapioFormService.resetForm(this.editForm, cardapio);
  }
}
