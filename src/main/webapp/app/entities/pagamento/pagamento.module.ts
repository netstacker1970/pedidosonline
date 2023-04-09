import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PagamentoComponent } from './list/pagamento.component';
import { PagamentoDetailComponent } from './detail/pagamento-detail.component';
import { PagamentoUpdateComponent } from './update/pagamento-update.component';
import { PagamentoDeleteDialogComponent } from './delete/pagamento-delete-dialog.component';
import { PagamentoRoutingModule } from './route/pagamento-routing.module';

@NgModule({
  imports: [SharedModule, PagamentoRoutingModule],
  declarations: [PagamentoComponent, PagamentoDetailComponent, PagamentoUpdateComponent, PagamentoDeleteDialogComponent],
})
export class PagamentoModule {}
