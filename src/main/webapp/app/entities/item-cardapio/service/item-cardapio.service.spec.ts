import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItemCardapio } from '../item-cardapio.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../item-cardapio.test-samples';

import { ItemCardapioService } from './item-cardapio.service';

const requireRestSample: IItemCardapio = {
  ...sampleWithRequiredData,
};

describe('ItemCardapio Service', () => {
  let service: ItemCardapioService;
  let httpMock: HttpTestingController;
  let expectedResult: IItemCardapio | IItemCardapio[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItemCardapioService);
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

    it('should create a ItemCardapio', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itemCardapio = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itemCardapio).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItemCardapio', () => {
      const itemCardapio = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itemCardapio).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItemCardapio', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItemCardapio', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ItemCardapio', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItemCardapioToCollectionIfMissing', () => {
      it('should add a ItemCardapio to an empty array', () => {
        const itemCardapio: IItemCardapio = sampleWithRequiredData;
        expectedResult = service.addItemCardapioToCollectionIfMissing([], itemCardapio);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemCardapio);
      });

      it('should not add a ItemCardapio to an array that contains it', () => {
        const itemCardapio: IItemCardapio = sampleWithRequiredData;
        const itemCardapioCollection: IItemCardapio[] = [
          {
            ...itemCardapio,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItemCardapioToCollectionIfMissing(itemCardapioCollection, itemCardapio);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItemCardapio to an array that doesn't contain it", () => {
        const itemCardapio: IItemCardapio = sampleWithRequiredData;
        const itemCardapioCollection: IItemCardapio[] = [sampleWithPartialData];
        expectedResult = service.addItemCardapioToCollectionIfMissing(itemCardapioCollection, itemCardapio);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemCardapio);
      });

      it('should add only unique ItemCardapio to an array', () => {
        const itemCardapioArray: IItemCardapio[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itemCardapioCollection: IItemCardapio[] = [sampleWithRequiredData];
        expectedResult = service.addItemCardapioToCollectionIfMissing(itemCardapioCollection, ...itemCardapioArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itemCardapio: IItemCardapio = sampleWithRequiredData;
        const itemCardapio2: IItemCardapio = sampleWithPartialData;
        expectedResult = service.addItemCardapioToCollectionIfMissing([], itemCardapio, itemCardapio2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemCardapio);
        expect(expectedResult).toContain(itemCardapio2);
      });

      it('should accept null and undefined values', () => {
        const itemCardapio: IItemCardapio = sampleWithRequiredData;
        expectedResult = service.addItemCardapioToCollectionIfMissing([], null, itemCardapio, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemCardapio);
      });

      it('should return initial array if no ItemCardapio is added', () => {
        const itemCardapioCollection: IItemCardapio[] = [sampleWithRequiredData];
        expectedResult = service.addItemCardapioToCollectionIfMissing(itemCardapioCollection, undefined, null);
        expect(expectedResult).toEqual(itemCardapioCollection);
      });
    });

    describe('compareItemCardapio', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItemCardapio(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareItemCardapio(entity1, entity2);
        const compareResult2 = service.compareItemCardapio(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareItemCardapio(entity1, entity2);
        const compareResult2 = service.compareItemCardapio(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareItemCardapio(entity1, entity2);
        const compareResult2 = service.compareItemCardapio(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
