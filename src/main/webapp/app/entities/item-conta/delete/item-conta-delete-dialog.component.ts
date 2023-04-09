import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IItemConta } from '../item-conta.model';
import { ItemContaService } from '../service/item-conta.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './item-conta-delete-dialog.component.html',
})
export class ItemContaDeleteDialogComponent {
  itemConta?: IItemConta;

  constructor(protected itemContaService: ItemContaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itemContaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
