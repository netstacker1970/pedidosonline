import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IItemConta } from '../item-conta.model';
import { ItemContaService } from '../service/item-conta.service';

@Injectable({ providedIn: 'root' })
export class ItemContaRoutingResolveService implements Resolve<IItemConta | null> {
  constructor(protected service: ItemContaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IItemConta | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((itemConta: HttpResponse<IItemConta>) => {
          if (itemConta.body) {
            return of(itemConta.body);
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
