import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItemCardapioComponent } from './list/item-cardapio.component';
import { ItemCardapioDetailComponent } from './detail/item-cardapio-detail.component';
import { ItemCardapioUpdateComponent } from './update/item-cardapio-update.component';
import { ItemCardapioDeleteDialogComponent } from './delete/item-cardapio-delete-dialog.component';
import { ItemCardapioRoutingModule } from './route/item-cardapio-routing.module';

@NgModule({
  imports: [SharedModule, ItemCardapioRoutingModule],
  declarations: [ItemCardapioComponent, ItemCardapioDetailComponent, ItemCardapioUpdateComponent, ItemCardapioDeleteDialogComponent],
})
export class ItemCardapioModule {}
