import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItemContaService } from '../service/item-conta.service';

import { ItemContaComponent } from './item-conta.component';

describe('ItemConta Management Component', () => {
  let comp: ItemContaComponent;
  let fixture: ComponentFixture<ItemContaComponent>;
  let service: ItemContaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'item-conta', component: ItemContaComponent }]), HttpClientTestingModule],
      declarations: [ItemContaComponent],
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
      .overrideTemplate(ItemContaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemContaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItemContaService);

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
    expect(comp.itemContas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itemContaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItemContaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItemContaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
