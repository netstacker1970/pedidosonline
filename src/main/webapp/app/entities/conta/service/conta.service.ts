import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConta, NewConta } from '../conta.model';

export type PartialUpdateConta = Partial<IConta> & Pick<IConta, 'id'>;

type RestOf<T extends IConta | NewConta> = Omit<T, 'dtConta'> & {
  dtConta?: string | null;
};

export type RestConta = RestOf<IConta>;

export type NewRestConta = RestOf<NewConta>;

export type PartialUpdateRestConta = RestOf<PartialUpdateConta>;

export type EntityResponseType = HttpResponse<IConta>;
export type EntityArrayResponseType = HttpResponse<IConta[]>;

@Injectable({ providedIn: 'root' })
export class ContaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/contas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(conta: NewConta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(conta);
    return this.http.post<RestConta>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(conta: IConta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(conta);
    return this.http
      .put<RestConta>(`${this.resourceUrl}/${this.getContaIdentifier(conta)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(conta: PartialUpdateConta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(conta);
    return this.http
      .patch<RestConta>(`${this.resourceUrl}/${this.getContaIdentifier(conta)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestConta>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestConta[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getContaIdentifier(conta: Pick<IConta, 'id'>): number {
    return conta.id;
  }

  compareConta(o1: Pick<IConta, 'id'> | null, o2: Pick<IConta, 'id'> | null): boolean {
    return o1 && o2 ? this.getContaIdentifier(o1) === this.getContaIdentifier(o2) : o1 === o2;
  }

  addContaToCollectionIfMissing<Type extends Pick<IConta, 'id'>>(
    contaCollection: Type[],
    ...contasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const contas: Type[] = contasToCheck.filter(isPresent);
    if (contas.length > 0) {
      const contaCollectionIdentifiers = contaCollection.map(contaItem => this.getContaIdentifier(contaItem)!);
      const contasToAdd = contas.filter(contaItem => {
        const contaIdentifier = this.getContaIdentifier(contaItem);
        if (contaCollectionIdentifiers.includes(contaIdentifier)) {
          return false;
        }
        contaCollectionIdentifiers.push(contaIdentifier);
        return true;
      });
      return [...contasToAdd, ...contaCollection];
    }
    return contaCollection;
  }

  protected convertDateFromClient<T extends IConta | NewConta | PartialUpdateConta>(conta: T): RestOf<T> {
    return {
      ...conta,
      dtConta: conta.dtConta?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restConta: RestConta): IConta {
    return {
      ...restConta,
      dtConta: restConta.dtConta ? dayjs(restConta.dtConta) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestConta>): HttpResponse<IConta> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestConta[]>): HttpResponse<IConta[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
