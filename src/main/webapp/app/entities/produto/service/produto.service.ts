import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProduto, NewProduto } from '../produto.model';

export type PartialUpdateProduto = Partial<IProduto> & Pick<IProduto, 'id'>;

type RestOf<T extends IProduto | NewProduto> = Omit<T, 'produto'> & {
  produto?: string | null;
};

export type RestProduto = RestOf<IProduto>;

export type NewRestProduto = RestOf<NewProduto>;

export type PartialUpdateRestProduto = RestOf<PartialUpdateProduto>;

export type EntityResponseType = HttpResponse<IProduto>;
export type EntityArrayResponseType = HttpResponse<IProduto[]>;

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/produtos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(produto: NewProduto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(produto);
    return this.http
      .post<RestProduto>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(produto: IProduto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(produto);
    return this.http
      .put<RestProduto>(`${this.resourceUrl}/${this.getProdutoIdentifier(produto)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(produto: PartialUpdateProduto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(produto);
    return this.http
      .patch<RestProduto>(`${this.resourceUrl}/${this.getProdutoIdentifier(produto)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProduto>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProduto[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProdutoIdentifier(produto: Pick<IProduto, 'id'>): number {
    return produto.id;
  }

  compareProduto(o1: Pick<IProduto, 'id'> | null, o2: Pick<IProduto, 'id'> | null): boolean {
    return o1 && o2 ? this.getProdutoIdentifier(o1) === this.getProdutoIdentifier(o2) : o1 === o2;
  }

  addProdutoToCollectionIfMissing<Type extends Pick<IProduto, 'id'>>(
    produtoCollection: Type[],
    ...produtosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const produtos: Type[] = produtosToCheck.filter(isPresent);
    if (produtos.length > 0) {
      const produtoCollectionIdentifiers = produtoCollection.map(produtoItem => this.getProdutoIdentifier(produtoItem)!);
      const produtosToAdd = produtos.filter(produtoItem => {
        const produtoIdentifier = this.getProdutoIdentifier(produtoItem);
        if (produtoCollectionIdentifiers.includes(produtoIdentifier)) {
          return false;
        }
        produtoCollectionIdentifiers.push(produtoIdentifier);
        return true;
      });
      return [...produtosToAdd, ...produtoCollection];
    }
    return produtoCollection;
  }

  protected convertDateFromClient<T extends IProduto | NewProduto | PartialUpdateProduto>(produto: T): RestOf<T> {
    return {
      ...produto,
      produto: produto.produto?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restProduto: RestProduto): IProduto {
    return {
      ...restProduto,
      produto: restProduto.produto ? dayjs(restProduto.produto) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProduto>): HttpResponse<IProduto> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProduto[]>): HttpResponse<IProduto[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
