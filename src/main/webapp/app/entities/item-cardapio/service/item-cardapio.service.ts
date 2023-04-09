import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItemCardapio, NewItemCardapio } from '../item-cardapio.model';

export type PartialUpdateItemCardapio = Partial<IItemCardapio> & Pick<IItemCardapio, 'id'>;

export type EntityResponseType = HttpResponse<IItemCardapio>;
export type EntityArrayResponseType = HttpResponse<IItemCardapio[]>;

@Injectable({ providedIn: 'root' })
export class ItemCardapioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/item-cardapios');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(itemCardapio: NewItemCardapio): Observable<EntityResponseType> {
    return this.http.post<IItemCardapio>(this.resourceUrl, itemCardapio, { observe: 'response' });
  }

  update(itemCardapio: IItemCardapio): Observable<EntityResponseType> {
    return this.http.put<IItemCardapio>(`${this.resourceUrl}/${this.getItemCardapioIdentifier(itemCardapio)}`, itemCardapio, {
      observe: 'response',
    });
  }

  partialUpdate(itemCardapio: PartialUpdateItemCardapio): Observable<EntityResponseType> {
    return this.http.patch<IItemCardapio>(`${this.resourceUrl}/${this.getItemCardapioIdentifier(itemCardapio)}`, itemCardapio, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IItemCardapio>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IItemCardapio[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItemCardapioIdentifier(itemCardapio: Pick<IItemCardapio, 'id'>): number {
    return itemCardapio.id;
  }

  compareItemCardapio(o1: Pick<IItemCardapio, 'id'> | null, o2: Pick<IItemCardapio, 'id'> | null): boolean {
    return o1 && o2 ? this.getItemCardapioIdentifier(o1) === this.getItemCardapioIdentifier(o2) : o1 === o2;
  }

  addItemCardapioToCollectionIfMissing<Type extends Pick<IItemCardapio, 'id'>>(
    itemCardapioCollection: Type[],
    ...itemCardapiosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const itemCardapios: Type[] = itemCardapiosToCheck.filter(isPresent);
    if (itemCardapios.length > 0) {
      const itemCardapioCollectionIdentifiers = itemCardapioCollection.map(
        itemCardapioItem => this.getItemCardapioIdentifier(itemCardapioItem)!
      );
      const itemCardapiosToAdd = itemCardapios.filter(itemCardapioItem => {
        const itemCardapioIdentifier = this.getItemCardapioIdentifier(itemCardapioItem);
        if (itemCardapioCollectionIdentifiers.includes(itemCardapioIdentifier)) {
          return false;
        }
        itemCardapioCollectionIdentifiers.push(itemCardapioIdentifier);
        return true;
      });
      return [...itemCardapiosToAdd, ...itemCardapioCollection];
    }
    return itemCardapioCollection;
  }
}
