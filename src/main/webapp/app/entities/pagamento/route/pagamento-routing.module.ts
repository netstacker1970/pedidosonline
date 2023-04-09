import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PagamentoComponent } from '../list/pagamento.component';
import { PagamentoDetailComponent } from '../detail/pagamento-detail.component';
import { PagamentoUpdateComponent } from '../update/pagamento-update.component';
import { PagamentoRoutingResolveService } from './pagamento-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const pagamentoRoute: Routes = [
  {
    path: '',
    component: PagamentoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PagamentoDetailComponent,
    resolve: {
      pagamento: PagamentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PagamentoUpdateComponent,
    resolve: {
      pagamento: PagamentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PagamentoUpdateComponent,
    resolve: {
      pagamento: PagamentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pagamentoRoute)],
  exports: [RouterModule],
})
export class PagamentoRoutingModule {}
