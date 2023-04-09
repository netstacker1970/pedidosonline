import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItemCardapioFormService } from './item-cardapio-form.service';
import { ItemCardapioService } from '../service/item-cardapio.service';
import { IItemCardapio } from '../item-cardapio.model';
import { ICardapio } from 'app/entities/cardapio/cardapio.model';
import { CardapioService } from 'app/entities/cardapio/service/cardapio.service';
import { IProduto } from 'app/entities/produto/produto.model';
import { ProdutoService } from 'app/entities/produto/service/produto.service';

import { ItemCardapioUpdateComponent } from './item-cardapio-update.component';

describe('ItemCardapio Management Update Component', () => {
  let comp: ItemCardapioUpdateComponent;
  let fixture: ComponentFixture<ItemCardapioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itemCardapioFormService: ItemCardapioFormService;
  let itemCardapioService: ItemCardapioService;
  let cardapioService: CardapioService;
  let produtoService: ProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItemCardapioUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ItemCardapioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemCardapioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itemCardapioFormService = TestBed.inject(ItemCardapioFormService);
    itemCardapioService = TestBed.inject(ItemCardapioService);
    cardapioService = TestBed.inject(CardapioService);
    produtoService = TestBed.inject(ProdutoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Cardapio query and add missing value', () => {
      const itemCardapio: IItemCardapio = { id: 456 };
      const cardapio: ICardapio = { id: 54419 };
      itemCardapio.cardapio = cardapio;

      const cardapioCollection: ICardapio[] = [{ id: 50382 }];
      jest.spyOn(cardapioService, 'query').mockReturnValue(of(new HttpResponse({ body: cardapioCollection })));
      const additionalCardapios = [cardapio];
      const expectedCollection: ICardapio[] = [...additionalCardapios, ...cardapioCollection];
      jest.spyOn(cardapioService, 'addCardapioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itemCardapio });
      comp.ngOnInit();

      expect(cardapioService.query).toHaveBeenCalled();
      expect(cardapioService.addCardapioToCollectionIfMissing).toHaveBeenCalledWith(
        cardapioCollection,
        ...additionalCardapios.map(expect.objectContaining)
      );
      expect(comp.cardapiosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Produto query and add missing value', () => {
      const itemCardapio: IItemCardapio = { id: 456 };
      const produto: IProduto = { id: 87305 };
      itemCardapio.produto = produto;

      const produtoCollection: IProduto[] = [{ id: 49446 }];
      jest.spyOn(produtoService, 'query').mockReturnValue(of(new HttpResponse({ body: produtoCollection })));
      const additionalProdutos = [produto];
      const expectedCollection: IProduto[] = [...additionalProdutos, ...produtoCollection];
      jest.spyOn(produtoService, 'addProdutoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itemCardapio });
      comp.ngOnInit();

      expect(produtoService.query).toHaveBeenCalled();
      expect(produtoService.addProdutoToCollectionIfMissing).toHaveBeenCalledWith(
        produtoCollection,
        ...additionalProdutos.map(expect.objectContaining)
      );
      expect(comp.produtosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const itemCardapio: IItemCardapio = { id: 456 };
      const cardapio: ICardapio = { id: 29491 };
      itemCardapio.cardapio = cardapio;
      const produto: IProduto = { id: 2420 };
      itemCardapio.produto = produto;

      activatedRoute.data = of({ itemCardapio });
      comp.ngOnInit();

      expect(comp.cardapiosSharedCollection).toContain(cardapio);
      expect(comp.produtosSharedCollection).toContain(produto);
      expect(comp.itemCardapio).toEqual(itemCardapio);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemCardapio>>();
      const itemCardapio = { id: 123 };
      jest.spyOn(itemCardapioFormService, 'getItemCardapio').mockReturnValue(itemCardapio);
      jest.spyOn(itemCardapioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemCardapio });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemCardapio }));
      saveSubject.complete();

      // THEN
      expect(itemCardapioFormService.getItemCardapio).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itemCardapioService.update).toHaveBeenCalledWith(expect.objectContaining(itemCardapio));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemCardapio>>();
      const itemCardapio = { id: 123 };
      jest.spyOn(itemCardapioFormService, 'getItemCardapio').mockReturnValue({ id: null });
      jest.spyOn(itemCardapioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemCardapio: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemCardapio }));
      saveSubject.complete();

      // THEN
      expect(itemCardapioFormService.getItemCardapio).toHaveBeenCalled();
      expect(itemCardapioService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemCardapio>>();
      const itemCardapio = { id: 123 };
      jest.spyOn(itemCardapioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemCardapio });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itemCardapioService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCardapio', () => {
      it('Should forward to cardapioService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(cardapioService, 'compareCardapio');
        comp.compareCardapio(entity, entity2);
        expect(cardapioService.compareCardapio).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProduto', () => {
      it('Should forward to produtoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(produtoService, 'compareProduto');
        comp.compareProduto(entity, entity2);
        expect(produtoService.compareProduto).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
