import sinon from 'sinon';
import Drug from "../../../src/domain-layer/entities/Drug";
import UpdateDrugTask, {UpdateDrugData} from '../../../src/service-layer/tasks/UpdateDrugTask';
import DatabaseConnectionMock from "./test-doubles/DatabaseConnectionMock";
import FindDrugTaskMock from "../controllers/test-doubles/FindDrugTaskMock";
import expect from 'expect';

describe('UpdateDrugTask tests', () => {
  let sandbox: sinon.SinonSandbox;
  let databaseConnectionMock: DatabaseConnectionMock;
  let findDrugTaskMock: FindDrugTaskMock;

  const drugData: UpdateDrugData = { id: 1,  name: 'Laramol', laboratory: 'Lucario', description: "Desinfectante visual", image: 'image29.jpg' };
  const expectedDrug = new Drug(drugData.id, drugData.name, drugData.laboratory, drugData.description, drugData.image);

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    databaseConnectionMock = new DatabaseConnectionMock(sandbox);
    findDrugTaskMock = new FindDrugTaskMock(sandbox);
  })

  afterEach(() => {
    sandbox.restore();
  });

  it('should update a drug', async () => {
    findDrugTaskMock.withExecuteReturning(expectedDrug);
    databaseConnectionMock.withSaveReturningEntity(expectedDrug);

    const task = new UpdateDrugTask(drugData);
    const drug = await task.execute();

    expect(drug).toEqual(expectedDrug);
  });
});