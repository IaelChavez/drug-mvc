import request from "supertest";
import sinon from "sinon";
import expect from 'expect';
import app from '../src/app';
import Drug from "../src/domain-layer/entities/Drug";
import GetDrugListTaskMock from "./service-layer/controllers/test-doubles/GetDrugListTaskMock";

describe('App tests', () => {
    context('Get drug list endpoint tests', () =>{
        let sandbox: sinon.SinonSandbox;
        let getDrugListTaskMock: GetDrugListTaskMock;

        const DrugsList: Drug[] =[
            new Drug(1, 'Paracetamol', 'Yuriria', "Te cura el cancer", 'image1.jpg'),
            new Drug(2, 'VICK', 'Barcelet', "Reconstruye las vias respiratorias", 'image2.jpg'),
            new Drug(3, 'Ibuprofeno', 'Umbrella', "Ayuda con la congestion nasal", 'image3.jpg'),
        ];

        before(() => {
            sandbox = sinon.createSandbox();
        });

        beforeEach(() => {
            getDrugListTaskMock = new GetDrugListTaskMock(sandbox);
        });

        afterEach(() =>{
            sandbox.restore();
        });

        it('should respond 200 OK and respond with a list of drugs', async () => {
            getDrugListTaskMock.withExecuteReturning(DrugsList);

            const response = await request(app)
             .get('/drugs')
             .expect(200);

            expect(response.body).toEqual(DrugsList) ;
            getDrugListTaskMock.expectExecuteWasCalledOnce();
        });

        it('should handle unknow errors and responde with 500 Internal Server Error', async () =>{
            getDrugListTaskMock.withExecuteThrowingError('I have a baaad feeling about this...');

            await request(app)
             .get('/drugs')
             .expect(500);

            getDrugListTaskMock.expectExecuteWasCalledOnce();
        });
    });
});