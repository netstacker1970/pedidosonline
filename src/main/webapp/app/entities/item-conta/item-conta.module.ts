import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItemContaComponent } from './list/item-conta.component';
import { ItemContaDetailComponent } from './detail/item-conta-detail.component';
import { ItemContaUpdateComponent } from './update/item-conta-update.component';
import { ItemContaDeleteDialogComponent } from './delete/item-conta-delete-dialog.component';
import { ItemContaRoutingModule } from './route/item-conta-routing.module';

@NgModule({
  imports: [SharedModule, ItemContaRoutingModule],
  declarations: [ItemContaComponent, ItemContaDetailComponent, ItemContaUpdateComponent, ItemContaDeleteDialogComponent],
})
export class ItemContaModule {}
