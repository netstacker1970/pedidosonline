import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICardapio } from '../cardapio.model';
import { CardapioService } from '../service/cardapio.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './cardapio-delete-dialog.component.html',
})
export class CardapioDeleteDialogComponent {
  cardapio?: ICardapio;

  constructor(protected cardapioService: CardapioService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cardapioService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
