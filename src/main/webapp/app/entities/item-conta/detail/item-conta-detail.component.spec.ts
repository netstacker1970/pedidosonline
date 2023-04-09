import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ItemContaDetailComponent } from './item-conta-detail.component';

describe('ItemConta Management Detail Component', () => {
  let comp: ItemContaDetailComponent;
  let fixture: ComponentFixture<ItemContaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemContaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ itemConta: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ItemContaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ItemContaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load itemConta on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.itemConta).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
