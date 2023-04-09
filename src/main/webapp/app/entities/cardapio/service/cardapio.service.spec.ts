import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ICardapio } from '../cardapio.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../cardapio.test-samples';

import { CardapioService, RestCardapio } from './cardapio.service';

const requireRestSample: RestCardapio = {
  ...sampleWithRequiredData,
  dtCardapio: sampleWithRequiredData.dtCardapio?.format(DATE_FORMAT),
};

describe('Cardapio Service', () => {
  let service: CardapioService;
  let httpMock: HttpTestingController;
  let expectedResult: ICardapio | ICardapio[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CardapioService);
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

    it('should create a Cardapio', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cardapio = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(cardapio).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Cardapio', () => {
      const cardapio = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(cardapio).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Cardapio', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Cardapio', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Cardapio', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCardapioToCollectionIfMissing', () => {
      it('should add a Cardapio to an empty array', () => {
        const cardapio: ICardapio = sampleWithRequiredData;
        expectedResult = service.addCardapioToCollectionIfMissing([], cardapio);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cardapio);
      });

      it('should not add a Cardapio to an array that contains it', () => {
        const cardapio: ICardapio = sampleWithRequiredData;
        const cardapioCollection: ICardapio[] = [
          {
            ...cardapio,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCardapioToCollectionIfMissing(cardapioCollection, cardapio);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Cardapio to an array that doesn't contain it", () => {
        const cardapio: ICardapio = sampleWithRequiredData;
        const cardapioCollection: ICardapio[] = [sampleWithPartialData];
        expectedResult = service.addCardapioToCollectionIfMissing(cardapioCollection, cardapio);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cardapio);
      });

      it('should add only unique Cardapio to an array', () => {
        const cardapioArray: ICardapio[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const cardapioCollection: ICardapio[] = [sampleWithRequiredData];
        expectedResult = service.addCardapioToCollectionIfMissing(cardapioCollection, ...cardapioArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const cardapio: ICardapio = sampleWithRequiredData;
        const cardapio2: ICardapio = sampleWithPartialData;
        expectedResult = service.addCardapioToCollectionIfMissing([], cardapio, cardapio2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cardapio);
        expect(expectedResult).toContain(cardapio2);
      });

      it('should accept null and undefined values', () => {
        const cardapio: ICardapio = sampleWithRequiredData;
        expectedResult = service.addCardapioToCollectionIfMissing([], null, cardapio, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cardapio);
      });

      it('should return initial array if no Cardapio is added', () => {
        const cardapioCollection: ICardapio[] = [sampleWithRequiredData];
        expectedResult = service.addCardapioToCollectionIfMissing(cardapioCollection, undefined, null);
        expect(expectedResult).toEqual(cardapioCollection);
      });
    });

    describe('compareCardapio', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCardapio(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCardapio(entity1, entity2);
        const compareResult2 = service.compareCardapio(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCardapio(entity1, entity2);
        const compareResult2 = service.compareCardapio(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCardapio(entity1, entity2);
        const compareResult2 = service.compareCardapio(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
