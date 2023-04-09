import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICaixa } from '../caixa.model';

@Component({
  selector: 'jhi-caixa-detail',
  templateUrl: './caixa-detail.component.html',
})
export class CaixaDetailComponent implements OnInit {
  caixa: ICaixa | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ caixa }) => {
      this.caixa = caixa;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
