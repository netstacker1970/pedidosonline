import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICaixa, NewCaixa } from '../caixa.model';

export type PartialUpdateCaixa = Partial<ICaixa> & Pick<ICaixa, 'id'>;

type RestOf<T extends ICaixa | NewCaixa> = Omit<T, 'dtAbertura' | 'dtFechamento'> & {
  dtAbertura?: string | null;
  dtFechamento?: string | null;
};

export type RestCaixa = RestOf<ICaixa>;

export type NewRestCaixa = RestOf<NewCaixa>;

export type PartialUpdateRestCaixa = RestOf<PartialUpdateCaixa>;

export type EntityResponseType = HttpResponse<ICaixa>;
export type EntityArrayResponseType = HttpResponse<ICaixa[]>;

@Injectable({ providedIn: 'root' })
export class CaixaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/caixas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(caixa: NewCaixa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(caixa);
    return this.http.post<RestCaixa>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(caixa: ICaixa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(caixa);
    return this.http
      .put<RestCaixa>(`${this.resourceUrl}/${this.getCaixaIdentifier(caixa)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(caixa: PartialUpdateCaixa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(caixa);
    return this.http
      .patch<RestCaixa>(`${this.resourceUrl}/${this.getCaixaIdentifier(caixa)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCaixa>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCaixa[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCaixaIdentifier(caixa: Pick<ICaixa, 'id'>): number {
    return caixa.id;
  }

  compareCaixa(o1: Pick<ICaixa, 'id'> | null, o2: Pick<ICaixa, 'id'> | null): boolean {
    return o1 && o2 ? this.getCaixaIdentifier(o1) === this.getCaixaIdentifier(o2) : o1 === o2;
  }

  addCaixaToCollectionIfMissing<Type extends Pick<ICaixa, 'id'>>(
    caixaCollection: Type[],
    ...caixasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const caixas: Type[] = caixasToCheck.filter(isPresent);
    if (caixas.length > 0) {
      const caixaCollectionIdentifiers = caixaCollection.map(caixaItem => this.getCaixaIdentifier(caixaItem)!);
      const caixasToAdd = caixas.filter(caixaItem => {
        const caixaIdentifier = this.getCaixaIdentifier(caixaItem);
        if (caixaCollectionIdentifiers.includes(caixaIdentifier)) {
          return false;
        }
        caixaCollectionIdentifiers.push(caixaIdentifier);
        return true;
      });
      return [...caixasToAdd, ...caixaCollection];
    }
    return caixaCollection;
  }

  protected convertDateFromClient<T extends ICaixa | NewCaixa | PartialUpdateCaixa>(caixa: T): RestOf<T> {
    return {
      ...caixa,
      dtAbertura: caixa.dtAbertura?.format(DATE_FORMAT) ?? null,
      dtFechamento: caixa.dtFechamento?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restCaixa: RestCaixa): ICaixa {
    return {
      ...restCaixa,
      dtAbertura: restCaixa.dtAbertura ? dayjs(restCaixa.dtAbertura) : undefined,
      dtFechamento: restCaixa.dtFechamento ? dayjs(restCaixa.dtFechamento) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCaixa>): HttpResponse<ICaixa> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCaixa[]>): HttpResponse<ICaixa[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
