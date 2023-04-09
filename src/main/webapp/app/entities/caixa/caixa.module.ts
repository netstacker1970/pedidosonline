import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CaixaComponent } from './list/caixa.component';
import { CaixaDetailComponent } from './detail/caixa-detail.component';
import { CaixaUpdateComponent } from './update/caixa-update.component';
import { CaixaDeleteDialogComponent } from './delete/caixa-delete-dialog.component';
import { CaixaRoutingModule } from './route/caixa-routing.module';

@NgModule({
  imports: [SharedModule, CaixaRoutingModule],
  declarations: [CaixaComponent, CaixaDetailComponent, CaixaUpdateComponent, CaixaDeleteDialogComponent],
})
export class CaixaModule {}
