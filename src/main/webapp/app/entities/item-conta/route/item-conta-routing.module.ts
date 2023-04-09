import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItemContaComponent } from '../list/item-conta.component';
import { ItemContaDetailComponent } from '../detail/item-conta-detail.component';
import { ItemContaUpdateComponent } from '../update/item-conta-update.component';
import { ItemContaRoutingResolveService } from './item-conta-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const itemContaRoute: Routes = [
  {
    path: '',
    component: ItemContaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItemContaDetailComponent,
    resolve: {
      itemConta: ItemContaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItemContaUpdateComponent,
    resolve: {
      itemConta: ItemContaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItemContaUpdateComponent,
    resolve: {
      itemConta: ItemContaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itemContaRoute)],
  exports: [RouterModule],
})
export class ItemContaRoutingModule {}
