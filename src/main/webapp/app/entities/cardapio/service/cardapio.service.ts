import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICardapio, NewCardapio } from '../cardapio.model';

export type PartialUpdateCardapio = Partial<ICardapio> & Pick<ICardapio, 'id'>;

type RestOf<T extends ICardapio | NewCardapio> = Omit<T, 'dtCardapio'> & {
  dtCardapio?: string | null;
};

export type RestCardapio = RestOf<ICardapio>;

export type NewRestCardapio = RestOf<NewCardapio>;

export type PartialUpdateRestCardapio = RestOf<PartialUpdateCardapio>;

export type EntityResponseType = HttpResponse<ICardapio>;
export type EntityArrayResponseType = HttpResponse<ICardapio[]>;

@Injectable({ providedIn: 'root' })
export class CardapioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cardapios');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(cardapio: NewCardapio): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cardapio);
    return this.http
      .post<RestCardapio>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(cardapio: ICardapio): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cardapio);
    return this.http
      .put<RestCardapio>(`${this.resourceUrl}/${this.getCardapioIdentifier(cardapio)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(cardapio: PartialUpdateCardapio): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cardapio);
    return this.http
      .patch<RestCardapio>(`${this.resourceUrl}/${this.getCardapioIdentifier(cardapio)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCardapio>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCardapio[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCardapioIdentifier(cardapio: Pick<ICardapio, 'id'>): number {
    return cardapio.id;
  }

  compareCardapio(o1: Pick<ICardapio, 'id'> | null, o2: Pick<ICardapio, 'id'> | null): boolean {
    return o1 && o2 ? this.getCardapioIdentifier(o1) === this.getCardapioIdentifier(o2) : o1 === o2;
  }

  addCardapioToCollectionIfMissing<Type extends Pick<ICardapio, 'id'>>(
    cardapioCollection: Type[],
    ...cardapiosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const cardapios: Type[] = cardapiosToCheck.filter(isPresent);
    if (cardapios.length > 0) {
      const cardapioCollectionIdentifiers = cardapioCollection.map(cardapioItem => this.getCardapioIdentifier(cardapioItem)!);
      const cardapiosToAdd = cardapios.filter(cardapioItem => {
        const cardapioIdentifier = this.getCardapioIdentifier(cardapioItem);
        if (cardapioCollectionIdentifiers.includes(cardapioIdentifier)) {
          return false;
        }
        cardapioCollectionIdentifiers.push(cardapioIdentifier);
        return true;
      });
      return [...cardapiosToAdd, ...cardapioCollection];
    }
    return cardapioCollection;
  }

  protected convertDateFromClient<T extends ICardapio | NewCardapio | PartialUpdateCardapio>(cardapio: T): RestOf<T> {
    return {
      ...cardapio,
      dtCardapio: cardapio.dtCardapio?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restCardapio: RestCardapio): ICardapio {
    return {
      ...restCardapio,
      dtCardapio: restCardapio.dtCardapio ? dayjs(restCardapio.dtCardapio) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCardapio>): HttpResponse<ICardapio> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCardapio[]>): HttpResponse<ICardapio[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
