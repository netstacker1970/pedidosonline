import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CaixaDetailComponent } from './caixa-detail.component';

describe('Caixa Management Detail Component', () => {
  let comp: CaixaDetailComponent;
  let fixture: ComponentFixture<CaixaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaixaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ caixa: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CaixaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CaixaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load caixa on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.caixa).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
