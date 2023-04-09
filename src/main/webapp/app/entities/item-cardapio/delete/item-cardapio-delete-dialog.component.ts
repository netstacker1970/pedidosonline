import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IItemCardapio } from '../item-cardapio.model';
import { ItemCardapioService } from '../service/item-cardapio.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './item-cardapio-delete-dialog.component.html',
})
export class ItemCardapioDeleteDialogComponent {
  itemCardapio?: IItemCardapio;

  constructor(protected itemCardapioService: ItemCardapioService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itemCardapioService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
