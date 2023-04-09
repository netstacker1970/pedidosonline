import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItemConta, NewItemConta } from '../item-conta.model';

export type PartialUpdateItemConta = Partial<IItemConta> & Pick<IItemConta, 'id'>;

export type EntityResponseType = HttpResponse<IItemConta>;
export type EntityArrayResponseType = HttpResponse<IItemConta[]>;

@Injectable({ providedIn: 'root' })
export class ItemContaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/item-contas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itemConta: NewItemConta): Observable<EntityResponseType> {
    return this.http.post<IItemConta>(this.resourceUrl, itemConta, { observe: 'response' });
  }

  update(itemConta: IItemConta): Observable<EntityResponseType> {
    return this.http.put<IItemConta>(`${this.resourceUrl}/${this.getItemContaIdentifier(itemConta)}`, itemConta, { observe: 'response' });
  }

  partialUpdate(itemConta: PartialUpdateItemConta): Observable<EntityResponseType> {
    return this.http.patch<IItemConta>(`${this.resourceUrl}/${this.getItemContaIdentifier(itemConta)}`, itemConta, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IItemConta>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IItemConta[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItemContaIdentifier(itemConta: Pick<IItemConta, 'id'>): number {
    return itemConta.id;
  }

  compareItemConta(o1: Pick<IItemConta, 'id'> | null, o2: Pick<IItemConta, 'id'> | null): boolean {
    return o1 && o2 ? this.getItemContaIdentifier(o1) === this.getItemContaIdentifier(o2) : o1 === o2;
  }

  addItemContaToCollectionIfMissing<Type extends Pick<IItemConta, 'id'>>(
    itemContaCollection: Type[],
    ...itemContasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itemContas: Type[] = itemContasToCheck.filter(isPresent);
    if (itemContas.length > 0) {
      const itemContaCollectionIdentifiers = itemContaCollection.map(itemContaItem => this.getItemContaIdentifier(itemContaItem)!);
      const itemContasToAdd = itemContas.filter(itemContaItem => {
        const itemContaIdentifier = this.getItemContaIdentifier(itemContaItem);
        if (itemContaCollectionIdentifiers.includes(itemContaIdentifier)) {
          return false;
        }
        itemContaCollectionIdentifiers.push(itemContaIdentifier);
        return true;
      });
      return [...itemContasToAdd, ...itemContaCollection];
    }
    return itemContaCollection;
  }
}
