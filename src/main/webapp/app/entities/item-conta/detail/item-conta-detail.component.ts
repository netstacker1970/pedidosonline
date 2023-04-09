import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IItemConta } from '../item-conta.model';

@Component({
  selector: 'jhi-item-conta-detail',
  templateUrl: './item-conta-detail.component.html',
})
export class ItemContaDetailComponent implements OnInit {
  itemConta: IItemConta | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ itemConta }) => {
      this.itemConta = itemConta;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
