import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICaixa } from '../caixa.model';
import { CaixaService } from '../service/caixa.service';

@Injectable({ providedIn: 'root' })
export class CaixaRoutingResolveService implements Resolve<ICaixa | null> {
  constructor(protected service: CaixaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICaixa | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((caixa: HttpResponse<ICaixa>) => {
          if (caixa.body) {
            return of(caixa.body);
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
