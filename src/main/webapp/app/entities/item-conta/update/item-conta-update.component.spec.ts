import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItemContaFormService } from './item-conta-form.service';
import { ItemContaService } from '../service/item-conta.service';
import { IItemConta } from '../item-conta.model';
import { IProduto } from 'app/entities/produto/produto.model';
import { ProdutoService } from 'app/entities/produto/service/produto.service';
import { IItemCardapio } from 'app/entities/item-cardapio/item-cardapio.model';
import { ItemCardapioService } from 'app/entities/item-cardapio/service/item-cardapio.service';
import { IConta } from 'app/entities/conta/conta.model';
import { ContaService } from 'app/entities/conta/service/conta.service';

import { ItemContaUpdateComponent } from './item-conta-update.component';

describe('ItemConta Management Update Component', () => {
  let comp: ItemContaUpdateComponent;
  let fixture: ComponentFixture<ItemContaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itemContaFormService: ItemContaFormService;
  let itemContaService: ItemContaService;
  let produtoService: ProdutoService;
  let itemCardapioService: ItemCardapioService;
  let contaService: ContaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItemContaUpdateComponent],
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
      .overrideTemplate(ItemContaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemContaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itemContaFormService = TestBed.inject(ItemContaFormService);
    itemContaService = TestBed.inject(ItemContaService);
    produtoService = TestBed.inject(ProdutoService);
    itemCardapioService = TestBed.inject(ItemCardapioService);
    contaService = TestBed.inject(ContaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Produto query and add missing value', () => {
      const itemConta: IItemConta = { id: 456 };
      const produto: IProduto = { id: 73864 };
      itemConta.produto = produto;

      const produtoCollection: IProduto[] = [{ id: 87173 }];
      jest.spyOn(produtoService, 'query').mockReturnValue(of(new HttpResponse({ body: produtoCollection })));
      const additionalProdutos = [produto];
      const expectedCollection: IProduto[] = [...additionalProdutos, ...produtoCollection];
      jest.spyOn(produtoService, 'addProdutoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itemConta });
      comp.ngOnInit();

      expect(produtoService.query).toHaveBeenCalled();
      expect(produtoService.addProdutoToCollectionIfMissing).toHaveBeenCalledWith(
        produtoCollection,
        ...additionalProdutos.map(expect.objectContaining)
      );
      expect(comp.produtosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ItemCardapio query and add missing value', () => {
      const itemConta: IItemConta = { id: 456 };
      const itemCardapio: IItemCardapio = { id: 34636 };
      itemConta.itemCardapio = itemCardapio;

      const itemCardapioCollection: IItemCardapio[] = [{ id: 1691 }];
      jest.spyOn(itemCardapioService, 'query').mockReturnValue(of(new HttpResponse({ body: itemCardapioCollection })));
      const additionalItemCardapios = [itemCardapio];
      const expectedCollection: IItemCardapio[] = [...additionalItemCardapios, ...itemCardapioCollection];
      jest.spyOn(itemCardapioService, 'addItemCardapioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itemConta });
      comp.ngOnInit();

      expect(itemCardapioService.query).toHaveBeenCalled();
      expect(itemCardapioService.addItemCardapioToCollectionIfMissing).toHaveBeenCalledWith(
        itemCardapioCollection,
        ...additionalItemCardapios.map(expect.objectContaining)
      );
      expect(comp.itemCardapiosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Conta query and add missing value', () => {
      const itemConta: IItemConta = { id: 456 };
      const conta: IConta = { id: 79455 };
      itemConta.conta = conta;

      const contaCollection: IConta[] = [{ id: 10587 }];
      jest.spyOn(contaService, 'query').mockReturnValue(of(new HttpResponse({ body: contaCollection })));
      const additionalContas = [conta];
      const expectedCollection: IConta[] = [...additionalContas, ...contaCollection];
      jest.spyOn(contaService, 'addContaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ itemConta });
      comp.ngOnInit();

      expect(contaService.query).toHaveBeenCalled();
      expect(contaService.addContaToCollectionIfMissing).toHaveBeenCalledWith(
        contaCollection,
        ...additionalContas.map(expect.objectContaining)
      );
      expect(comp.contasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const itemConta: IItemConta = { id: 456 };
      const produto: IProduto = { id: 15589 };
      itemConta.produto = produto;
      const itemCardapio: IItemCardapio = { id: 930 };
      itemConta.itemCardapio = itemCardapio;
      const conta: IConta = { id: 35790 };
      itemConta.conta = conta;

      activatedRoute.data = of({ itemConta });
      comp.ngOnInit();

      expect(comp.produtosSharedCollection).toContain(produto);
      expect(comp.itemCardapiosSharedCollection).toContain(itemCardapio);
      expect(comp.contasSharedCollection).toContain(conta);
      expect(comp.itemConta).toEqual(itemConta);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemConta>>();
      const itemConta = { id: 123 };
      jest.spyOn(itemContaFormService, 'getItemConta').mockReturnValue(itemConta);
      jest.spyOn(itemContaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemConta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemConta }));
      saveSubject.complete();

      // THEN
      expect(itemContaFormService.getItemConta).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(itemContaService.update).toHaveBeenCalledWith(expect.objectContaining(itemConta));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemConta>>();
      const itemConta = { id: 123 };
      jest.spyOn(itemContaFormService, 'getItemConta').mockReturnValue({ id: null });
      jest.spyOn(itemContaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemConta: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: itemConta }));
      saveSubject.complete();

      // THEN
      expect(itemContaFormService.getItemConta).toHaveBeenCalled();
      expect(itemContaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IItemConta>>();
      const itemConta = { id: 123 };
      jest.spyOn(itemContaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ itemConta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itemContaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProduto', () => {
      it('Should forward to produtoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(produtoService, 'compareProduto');
        comp.compareProduto(entity, entity2);
        expect(produtoService.compareProduto).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareItemCardapio', () => {
      it('Should forward to itemCardapioService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(itemCardapioService, 'compareItemCardapio');
        comp.compareItemCardapio(entity, entity2);
        expect(itemCardapioService.compareItemCardapio).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareConta', () => {
      it('Should forward to contaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(contaService, 'compareConta');
        comp.compareConta(entity, entity2);
        expect(contaService.compareConta).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
