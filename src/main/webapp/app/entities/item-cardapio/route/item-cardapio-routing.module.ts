import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItemCardapioComponent } from '../list/item-cardapio.component';
import { ItemCardapioDetailComponent } from '../detail/item-cardapio-detail.component';
import { ItemCardapioUpdateComponent } from '../update/item-cardapio-update.component';
import { ItemCardapioRoutingResolveService } from './item-cardapio-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const itemCardapioRoute: Routes = [
  {
    path: '',
    component: ItemCardapioComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItemCardapioDetailComponent,
    resolve: {
      itemCardapio: ItemCardapioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItemCardapioUpdateComponent,
    resolve: {
      itemCardapio: ItemCardapioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItemCardapioUpdateComponent,
    resolve: {
      itemCardapio: ItemCardapioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itemCardapioRoute)],
  exports: [RouterModule],
})
export class ItemCardapioRoutingModule {}
