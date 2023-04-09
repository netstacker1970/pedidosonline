import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItemCardapio } from '../item-cardapio.model';

@Component({
  selector: 'jhi-item-cardapio-detail',
  templateUrl: './item-cardapio-detail.component.html',
})
export class ItemCardapioDetailComponent implements OnInit {
  itemCardapio: IItemCardapio | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemCardapio }) => {
      this.itemCardapio = itemCardapio;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
