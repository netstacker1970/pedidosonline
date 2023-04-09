import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItemCardapio } from '../item-cardapio.model';
import { ItemCardapioService } from '../service/item-cardapio.service';

@Injectable({ providedIn: 'root' })
export class ItemCardapioRoutingResolveService implements Resolve<IItemCardapio | null> {
  constructor(protected service: ItemCardapioService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItemCardapio | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((itemCardapio: HttpResponse<IItemCardapio>) => {
          if (itemCardapio.body) {
            return of(itemCardapio.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
