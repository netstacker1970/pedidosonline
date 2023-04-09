import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ICaixa } from '../caixa.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../caixa.test-samples';

import { CaixaService, RestCaixa } from './caixa.service';

const requireRestSample: RestCaixa = {
  ...sampleWithRequiredData,
  dtAbertura: sampleWithRequiredData.dtAbertura?.format(DATE_FORMAT),
  dtFechamento: sampleWithRequiredData.dtFechamento?.format(DATE_FORMAT),
};

describe('Caixa Service', () => {
  let service: CaixaService;
  let httpMock: HttpTestingController;
  let expectedResult: ICaixa | ICaixa[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CaixaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Caixa', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const caixa = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(caixa).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Caixa', () => {
      const caixa = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(caixa).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Caixa', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Caixa', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Caixa', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCaixaToCollectionIfMissing', () => {
      it('should add a Caixa to an empty array', () => {
        const caixa: ICaixa = sampleWithRequiredData;
        expectedResult = service.addCaixaToCollectionIfMissing([], caixa);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(caixa);
      });

      it('should not add a Caixa to an array that contains it', () => {
        const caixa: ICaixa = sampleWithRequiredData;
        const caixaCollection: ICaixa[] = [
          {
            ...caixa,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCaixaToCollectionIfMissing(caixaCollection, caixa);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Caixa to an array that doesn't contain it", () => {
        const caixa: ICaixa = sampleWithRequiredData;
        const caixaCollection: ICaixa[] = [sampleWithPartialData];
        expectedResult = service.addCaixaToCollectionIfMissing(caixaCollection, caixa);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(caixa);
      });

      it('should add only unique Caixa to an array', () => {
        const caixaArray: ICaixa[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const caixaCollection: ICaixa[] = [sampleWithRequiredData];
        expectedResult = service.addCaixaToCollectionIfMissing(caixaCollection, ...caixaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const caixa: ICaixa = sampleWithRequiredData;
        const caixa2: ICaixa = sampleWithPartialData;
        expectedResult = service.addCaixaToCollectionIfMissing([], caixa, caixa2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(caixa);
        expect(expectedResult).toContain(caixa2);
      });

      it('should accept null and undefined values', () => {
        const caixa: ICaixa = sampleWithRequiredData;
        expectedResult = service.addCaixaToCollectionIfMissing([], null, caixa, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(caixa);
      });

      it('should return initial array if no Caixa is added', () => {
        const caixaCollection: ICaixa[] = [sampleWithRequiredData];
        expectedResult = service.addCaixaToCollectionIfMissing(caixaCollection, undefined, null);
        expect(expectedResult).toEqual(caixaCollection);
      });
    });

    describe('compareCaixa', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCaixa(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCaixa(entity1, entity2);
        const compareResult2 = service.compareCaixa(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCaixa(entity1, entity2);
        const compareResult2 = service.compareCaixa(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCaixa(entity1, entity2);
        const compareResult2 = service.compareCaixa(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
