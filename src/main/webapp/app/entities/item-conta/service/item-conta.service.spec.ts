import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IItemConta } from '../item-conta.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../item-conta.test-samples';

import { ItemContaService } from './item-conta.service';

const requireRestSample: IItemConta = {
  ...sampleWithRequiredData,
};

describe('ItemConta Service', () => {
  let service: ItemContaService;
  let httpMock: HttpTestingController;
  let expectedResult: IItemConta | IItemConta[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ItemContaService);
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

    it('should create a ItemConta', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const itemConta = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(itemConta).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ItemConta', () => {
      const itemConta = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(itemConta).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ItemConta', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ItemConta', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ItemConta', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addItemContaToCollectionIfMissing', () => {
      it('should add a ItemConta to an empty array', () => {
        const itemConta: IItemConta = sampleWithRequiredData;
        expectedResult = service.addItemContaToCollectionIfMissing([], itemConta);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemConta);
      });

      it('should not add a ItemConta to an array that contains it', () => {
        const itemConta: IItemConta = sampleWithRequiredData;
        const itemContaCollection: IItemConta[] = [
          {
            ...itemConta,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addItemContaToCollectionIfMissing(itemContaCollection, itemConta);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ItemConta to an array that doesn't contain it", () => {
        const itemConta: IItemConta = sampleWithRequiredData;
        const itemContaCollection: IItemConta[] = [sampleWithPartialData];
        expectedResult = service.addItemContaToCollectionIfMissing(itemContaCollection, itemConta);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemConta);
      });

      it('should add only unique ItemConta to an array', () => {
        const itemContaArray: IItemConta[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const itemContaCollection: IItemConta[] = [sampleWithRequiredData];
        expectedResult = service.addItemContaToCollectionIfMissing(itemContaCollection, ...itemContaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const itemConta: IItemConta = sampleWithRequiredData;
        const itemConta2: IItemConta = sampleWithPartialData;
        expectedResult = service.addItemContaToCollectionIfMissing([], itemConta, itemConta2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(itemConta);
        expect(expectedResult).toContain(itemConta2);
      });

      it('should accept null and undefined values', () => {
        const itemConta: IItemConta = sampleWithRequiredData;
        expectedResult = service.addItemContaToCollectionIfMissing([], null, itemConta, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(itemConta);
      });

      it('should return initial array if no ItemConta is added', () => {
        const itemContaCollection: IItemConta[] = [sampleWithRequiredData];
        expectedResult = service.addItemContaToCollectionIfMissing(itemContaCollection, undefined, null);
        expect(expectedResult).toEqual(itemContaCollection);
      });
    });

    describe('compareItemConta', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareItemConta(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareItemConta(entity1, entity2);
        const compareResult2 = service.compareItemConta(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareItemConta(entity1, entity2);
        const compareResult2 = service.compareItemConta(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareItemConta(entity1, entity2);
        const compareResult2 = service.compareItemConta(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
