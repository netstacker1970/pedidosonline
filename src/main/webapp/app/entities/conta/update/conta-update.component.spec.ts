import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ContaFormService } from './conta-form.service';
import { ContaService } from '../service/conta.service';
import { IConta } from '../conta.model';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { ICaixa } from 'app/entities/caixa/caixa.model';
import { CaixaService } from 'app/entities/caixa/service/caixa.service';

import { ContaUpdateComponent } from './conta-update.component';

describe('Conta Management Update Component', () => {
  let comp: ContaUpdateComponent;
  let fixture: ComponentFixture<ContaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let contaFormService: ContaFormService;
  let contaService: ContaService;
  let clienteService: ClienteService;
  let caixaService: CaixaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ContaUpdateComponent],
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
      .overrideTemplate(ContaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    contaFormService = TestBed.inject(ContaFormService);
    contaService = TestBed.inject(ContaService);
    clienteService = TestBed.inject(ClienteService);
    caixaService = TestBed.inject(CaixaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Cliente query and add missing value', () => {
      const conta: IConta = { id: 456 };
      const cliente: ICliente = { id: 86942 };
      conta.cliente = cliente;

      const clienteCollection: ICliente[] = [{ id: 6827 }];
      jest.spyOn(clienteService, 'query').mockReturnValue(of(new HttpResponse({ body: clienteCollection })));
      const additionalClientes = [cliente];
      const expectedCollection: ICliente[] = [...additionalClientes, ...clienteCollection];
      jest.spyOn(clienteService, 'addClienteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ conta });
      comp.ngOnInit();

      expect(clienteService.query).toHaveBeenCalled();
      expect(clienteService.addClienteToCollectionIfMissing).toHaveBeenCalledWith(
        clienteCollection,
        ...additionalClientes.map(expect.objectContaining)
      );
      expect(comp.clientesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Caixa query and add missing value', () => {
      const conta: IConta = { id: 456 };
      const caixa: ICaixa = { id: 86019 };
      conta.caixa = caixa;

      const caixaCollection: ICaixa[] = [{ id: 12332 }];
      jest.spyOn(caixaService, 'query').mockReturnValue(of(new HttpResponse({ body: caixaCollection })));
      const additionalCaixas = [caixa];
      const expectedCollection: ICaixa[] = [...additionalCaixas, ...caixaCollection];
      jest.spyOn(caixaService, 'addCaixaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ conta });
      comp.ngOnInit();

      expect(caixaService.query).toHaveBeenCalled();
      expect(caixaService.addCaixaToCollectionIfMissing).toHaveBeenCalledWith(
        caixaCollection,
        ...additionalCaixas.map(expect.objectContaining)
      );
      expect(comp.caixasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const conta: IConta = { id: 456 };
      const cliente: ICliente = { id: 73463 };
      conta.cliente = cliente;
      const caixa: ICaixa = { id: 25782 };
      conta.caixa = caixa;

      activatedRoute.data = of({ conta });
      comp.ngOnInit();

      expect(comp.clientesSharedCollection).toContain(cliente);
      expect(comp.caixasSharedCollection).toContain(caixa);
      expect(comp.conta).toEqual(conta);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConta>>();
      const conta = { id: 123 };
      jest.spyOn(contaFormService, 'getConta').mockReturnValue(conta);
      jest.spyOn(contaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: conta }));
      saveSubject.complete();

      // THEN
      expect(contaFormService.getConta).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(contaService.update).toHaveBeenCalledWith(expect.objectContaining(conta));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConta>>();
      const conta = { id: 123 };
      jest.spyOn(contaFormService, 'getConta').mockReturnValue({ id: null });
      jest.spyOn(contaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conta: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: conta }));
      saveSubject.complete();

      // THEN
      expect(contaFormService.getConta).toHaveBeenCalled();
      expect(contaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConta>>();
      const conta = { id: 123 };
      jest.spyOn(contaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(contaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCliente', () => {
      it('Should forward to clienteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(clienteService, 'compareCliente');
        comp.compareCliente(entity, entity2);
        expect(clienteService.compareCliente).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCaixa', () => {
      it('Should forward to caixaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(caixaService, 'compareCaixa');
        comp.compareCaixa(entity, entity2);
        expect(caixaService.compareCaixa).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
