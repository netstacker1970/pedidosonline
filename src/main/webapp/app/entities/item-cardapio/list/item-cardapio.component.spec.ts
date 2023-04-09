import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItemCardapioService } from '../service/item-cardapio.service';

import { ItemCardapioComponent } from './item-cardapio.component';

describe('ItemCardapio Management Component', () => {
  let comp: ItemCardapioComponent;
  let fixture: ComponentFixture<ItemCardapioComponent>;
  let service: ItemCardapioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'item-cardapio', component: ItemCardapioComponent }]), HttpClientTestingModule],
      declarations: [ItemCardapioComponent],
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
      .overrideTemplate(ItemCardapioComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemCardapioComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItemCardapioService);

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
    expect(comp.itemCardapios?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itemCardapioService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItemCardapioIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItemCardapioIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
