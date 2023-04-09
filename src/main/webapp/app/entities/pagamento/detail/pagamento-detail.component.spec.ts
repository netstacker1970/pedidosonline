import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PagamentoDetailComponent } from './pagamento-detail.component';

describe('Pagamento Management Detail Component', () => {
  let comp: PagamentoDetailComponent;
  let fixture: ComponentFixture<PagamentoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagamentoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ pagamento: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PagamentoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PagamentoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pagamento on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.pagamento).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
