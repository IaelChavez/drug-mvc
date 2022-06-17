import sinon from 'sinon';
import DeleteDrugTask from "../../../src/service-layer/tasks/DeleteDrugTask";
import DatabaseConnectionMock from "./test-doubles/DatabaseConnectionMock";
import Drug from "../../../src/domain-layer/entities/Drug";

describe('DeleteDrugTask tests', () => {
    let sandbox: sinon.SinonSandbox;
    let databaseConnectionMock: DatabaseConnectionMock;

    const drugId = 1;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        databaseConnectionMock = new DatabaseConnectionMock(sandbox);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should delete a drug', async () => {
        databaseConnectionMock.withDeleteSucceeding();

        const task = new DeleteDrugTask(drugId);
        await task.execute();

        databaseConnectionMock.expectGotRepositoryOf(Drug);
        databaseConnectionMock.expectDeleteCalledOnceWith(drugId);
    });
});