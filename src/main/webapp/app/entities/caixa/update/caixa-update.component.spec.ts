import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CaixaFormService } from './caixa-form.service';
import { CaixaService } from '../service/caixa.service';
import { ICaixa } from '../caixa.model';

import { CaixaUpdateComponent } from './caixa-update.component';

describe('Caixa Management Update Component', () => {
  let comp: CaixaUpdateComponent;
  let fixture: ComponentFixture<CaixaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let caixaFormService: CaixaFormService;
  let caixaService: CaixaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CaixaUpdateComponent],
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
      .overrideTemplate(CaixaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CaixaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    caixaFormService = TestBed.inject(CaixaFormService);
    caixaService = TestBed.inject(CaixaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const caixa: ICaixa = { id: 456 };

      activatedRoute.data = of({ caixa });
      comp.ngOnInit();

      expect(comp.caixa).toEqual(caixa);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaixa>>();
      const caixa = { id: 123 };
      jest.spyOn(caixaFormService, 'getCaixa').mockReturnValue(caixa);
      jest.spyOn(caixaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caixa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: caixa }));
      saveSubject.complete();

      // THEN
      expect(caixaFormService.getCaixa).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(caixaService.update).toHaveBeenCalledWith(expect.objectContaining(caixa));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaixa>>();
      const caixa = { id: 123 };
      jest.spyOn(caixaFormService, 'getCaixa').mockReturnValue({ id: null });
      jest.spyOn(caixaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caixa: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: caixa }));
      saveSubject.complete();

      // THEN
      expect(caixaFormService.getCaixa).toHaveBeenCalled();
      expect(caixaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaixa>>();
      const caixa = { id: 123 };
      jest.spyOn(caixaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caixa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(caixaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
