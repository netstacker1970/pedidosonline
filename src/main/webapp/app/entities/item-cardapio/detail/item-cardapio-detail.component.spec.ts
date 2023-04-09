import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ItemCardapioDetailComponent } from './item-cardapio-detail.component';

describe('ItemCardapio Management Detail Component', () => {
  let comp: ItemCardapioDetailComponent;
  let fixture: ComponentFixture<ItemCardapioDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemCardapioDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ itemCardapio: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ItemCardapioDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ItemCardapioDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load itemCardapio on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.itemCardapio).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
