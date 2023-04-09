import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PagamentoFormService } from './pagamento-form.service';
import { PagamentoService } from '../service/pagamento.service';
import { IPagamento } from '../pagamento.model';
import { IConta } from 'app/entities/conta/conta.model';
import { ContaService } from 'app/entities/conta/service/conta.service';

import { PagamentoUpdateComponent } from './pagamento-update.component';

describe('Pagamento Management Update Component', () => {
  let comp: PagamentoUpdateComponent;
  let fixture: ComponentFixture<PagamentoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pagamentoFormService: PagamentoFormService;
  let pagamentoService: PagamentoService;
  let contaService: ContaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PagamentoUpdateComponent],
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
      .overrideTemplate(PagamentoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PagamentoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pagamentoFormService = TestBed.inject(PagamentoFormService);
    pagamentoService = TestBed.inject(PagamentoService);
    contaService = TestBed.inject(ContaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Conta query and add missing value', () => {
      const pagamento: IPagamento = { id: 456 };
      const conta: IConta = { id: 9067 };
      pagamento.conta = conta;
      const cliente: IConta = { id: 1906 };
      pagamento.cliente = cliente;

      const contaCollection: IConta[] = [{ id: 83616 }];
      jest.spyOn(contaService, 'query').mockReturnValue(of(new HttpResponse({ body: contaCollection })));
      const additionalContas = [conta, cliente];
      const expectedCollection: IConta[] = [...additionalContas, ...contaCollection];
      jest.spyOn(contaService, 'addContaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pagamento });
      comp.ngOnInit();

      expect(contaService.query).toHaveBeenCalled();
      expect(contaService.addContaToCollectionIfMissing).toHaveBeenCalledWith(
        contaCollection,
        ...additionalContas.map(expect.objectContaining)
      );
      expect(comp.contasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pagamento: IPagamento = { id: 456 };
      const conta: IConta = { id: 50248 };
      pagamento.conta = conta;
      const cliente: IConta = { id: 68977 };
      pagamento.cliente = cliente;

      activatedRoute.data = of({ pagamento });
      comp.ngOnInit();

      expect(comp.contasSharedCollection).toContain(conta);
      expect(comp.contasSharedCollection).toContain(cliente);
      expect(comp.pagamento).toEqual(pagamento);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPagamento>>();
      const pagamento = { id: 123 };
      jest.spyOn(pagamentoFormService, 'getPagamento').mockReturnValue(pagamento);
      jest.spyOn(pagamentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pagamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pagamento }));
      saveSubject.complete();

      // THEN
      expect(pagamentoFormService.getPagamento).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pagamentoService.update).toHaveBeenCalledWith(expect.objectContaining(pagamento));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPagamento>>();
      const pagamento = { id: 123 };
      jest.spyOn(pagamentoFormService, 'getPagamento').mockReturnValue({ id: null });
      jest.spyOn(pagamentoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pagamento: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pagamento }));
      saveSubject.complete();

      // THEN
      expect(pagamentoFormService.getPagamento).toHaveBeenCalled();
      expect(pagamentoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPagamento>>();
      const pagamento = { id: 123 };
      jest.spyOn(pagamentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pagamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pagamentoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
