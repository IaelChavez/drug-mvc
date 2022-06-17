import sinon from "sinon";
import Drug from "../../../src/domain-layer/entities/Drug";
import DatabaseConnectionMock from "./test-doubles/DatabaseConnectionMock";
import FindDrugTask from "../../../src/service-layer/tasks/FindDrugTask";
import expect from 'expect';


describe('FindDrugTask tests', () => {
    let sandbox: sinon.SinonSandbox;
    let databaseConnectionMock: DatabaseConnectionMock;

    const drugId = 1;
    const expectedDrug = new Drug(drugId, 'Camelon', 'Larrion', "Cura la vista", 'balloon.jpg')

    before(() => {
        sandbox = sinon.createSandbox();
    });
    
    beforeEach(() => {
        databaseConnectionMock = new DatabaseConnectionMock(sandbox);
    })
    
    afterEach(() => {
        sandbox.restore();
    });

    it('should find a drug', async () => {
        databaseConnectionMock.withFindOneByReturningEntity(expectedDrug);
    
        const task = new FindDrugTask(drugId);
        const drug = await task.execute();
    
        expect(drug).toEqual(expectedDrug);
        databaseConnectionMock.expectGotRepositoryOf(Drug);
        databaseConnectionMock.expectFindOneByCalledOnceWith({ id: drugId });
    });

    it('should throw "Drug not found." if drug doesn\'t exist', async () => {
        databaseConnectionMock.withFindOneByReturningEntity(null);
    
        const task = new FindDrugTask(drugId);
        await expect(task.execute()).rejects.toThrow('Drug not found.');
    
        databaseConnectionMock.expectGotRepositoryOf(Drug);
        databaseConnectionMock.expectFindOneByCalledOnceWith({ id: drugId });
    });
});