import sinon from 'sinon';
import Drug from "../../../src/domain-layer/entities/Drug";
import DatabaseConnectionMock from "./test-doubles/DatabaseConnectionMock";
import GetDrugListTask from "../../../src/service-layer/tasks/GetDrugListTask";
import expect from "expect";
import Sinon from "sinon";

describe('GetDrugListTask tests', () => {
  let sandbox: sinon.SinonSandbox;
  let databaseConnectionMock: DatabaseConnectionMock;

  const expectedDrugsList: Drug[] = [
    new Drug(1, 'Lalom', 'Latam', "Repara la cara",  'image5.jpg'),
    new Drug(2, 'Comanol', 'EUWEST', "Limpia el coxis", 'image34.jpg'),
    new Drug(3, 'Lafimol', 'KOREM',  "Repara las escapulas", 'image78.jpg'),
  ];

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    databaseConnectionMock = new DatabaseConnectionMock(sandbox);
  })

  afterEach(() => {
    sandbox.restore();
  });

  it('should return a list of drugs', async () => {
    databaseConnectionMock.withFindReturningListOfEntities(expectedDrugsList);

    const task = new GetDrugListTask();
    const drugsList = await task.execute();

    expect(drugsList).toEqual(expectedDrugsList);
    databaseConnectionMock.expectGotRepositoryOf(Drug);
    databaseConnectionMock.expectFindCalledOnce();
  });
});