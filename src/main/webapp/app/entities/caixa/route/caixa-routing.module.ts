import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CaixaComponent } from '../list/caixa.component';
import { CaixaDetailComponent } from '../detail/caixa-detail.component';
import { CaixaUpdateComponent } from '../update/caixa-update.component';
import { CaixaRoutingResolveService } from './caixa-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const caixaRoute: Routes = [
  {
    path: '',
    component: CaixaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CaixaDetailComponent,
    resolve: {
      caixa: CaixaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CaixaUpdateComponent,
    resolve: {
      caixa: CaixaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CaixaUpdateComponent,
    resolve: {
      caixa: CaixaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(caixaRoute)],
  exports: [RouterModule],
})
export class CaixaRoutingModule {}
