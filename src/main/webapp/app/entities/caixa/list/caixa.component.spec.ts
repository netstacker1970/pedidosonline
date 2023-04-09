import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CaixaService } from '../service/caixa.service';

import { CaixaComponent } from './caixa.component';

describe('Caixa Management Component', () => {
  let comp: CaixaComponent;
  let fixture: ComponentFixture<CaixaComponent>;
  let service: CaixaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'caixa', component: CaixaComponent }]), HttpClientTestingModule],
      declarations: [CaixaComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(CaixaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CaixaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CaixaService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.caixas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to caixaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCaixaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCaixaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
