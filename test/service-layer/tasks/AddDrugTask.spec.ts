import sinon from 'sinon';
import DatabaseConnectionMock from "./test-doubles/DatabaseConnectionMock";
import AddDrugTask, { AddDrugData } from "../../../src/service-layer/tasks/AddDrugTask";
import Drug from "../../../src/domain-layer/entities/Drug";
import { expect } from "expect";

describe('AddDrugTask tests', () => {
    let sanbox: sinon.SinonSandbox;
    let databaseConnectionMock: DatabaseConnectionMock;

    const drugData: AddDrugData = { name: 'paralameton', laboratory: 'Indio', description: "Desinfectante pulmonar", image: 'image22222.jpg' }
    const expectedDrug = new Drug(1, drugData.name, drugData.laboratory, drugData.description, drugData.image);

    before(() => {
        sanbox = sinon.createSandbox();
    });

    beforeEach(() => {
        databaseConnectionMock = new DatabaseConnectionMock(sanbox);
    });

    afterEach(() => {
        sanbox.restore();
    });

    it('should add a drug to the database', async () => {
        databaseConnectionMock.withSaveReturningEntity(expectedDrug);

        const task = new AddDrugTask(drugData);
        const drug = await task.execute();

        expect(drug).toEqual(expectedDrug);
        databaseConnectionMock.expectGotRepositoryOf(Drug);
        databaseConnectionMock.expectSaveCalledOnceWith(drugData);
    });
});