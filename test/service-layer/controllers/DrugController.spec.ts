import request from "supertest";
import sinon from 'sinon';
import expect from "expect";
import app from "../../../src/app";
import Drug from "../../../src/domain-layer/entities/Drug";
import GetDrugListTaskMock from "./test-doubles/GetDrugListTaskMock";
import FindDrugTaskMock from "./test-doubles/FindDrugTaskMock";
import AddDrugTaskMock from "./test-doubles/AddDrugTaskMock";
import UpdateDrugTaskMock from "./test-doubles/UpdateDrugTaskMock";
import DeleteDrugTaskMock from "./test-doubles/DeleteDrugTaskMock";
import { AddDrugData } from "../../../src/service-layer/tasks/AddDrugTask";
import { UpdateDrugData } from "../../../src/service-layer/tasks/UpdateDrugTask";

describe('DrugsController tests', () => {
    let sandbox: sinon.SinonSandbox;
  
    before(() => {
      sandbox = sinon.createSandbox();
    });
  
    afterEach(() => {
      sandbox.restore();
    });
  
    context('Get drugs list endpoint tests', () => {
      let getDrugListTaskMock: GetDrugListTaskMock;
  
      const drugsList: Drug[] =[
        new Drug(1, 'Paracetamol', 'Yuriria', "Te cura el cancer", 'image1.jpg'),
        new Drug(2, 'VICK', 'Barcelet', "Reconstruye las vias respiratorias", 'image2.jpg'),
        new Drug(3, 'Ibuprofeno', 'Umbrella', "Ayuda con la congestion nasal", 'image3.jpg'),
    ];
  
      beforeEach(() => {
        getDrugListTaskMock = new GetDrugListTaskMock(sandbox);
      });
  
      it('should respond 200 OK and respond with a list of drugs', async () => {
        getDrugListTaskMock.withExecuteReturning(drugsList);
  
        const response = await request(app)
          .get('/drugs')
          .expect(200);
  
        expect(response.body).toEqual(drugsList);
        getDrugListTaskMock.expectExecuteWasCalledOnce();
      });
  
      it('should handle unknown errors and respond with 500 Internal Server Error', async () => {
        getDrugListTaskMock.withExecuteThrowingError('I have a baaad feeling about this...');
  
        await request(app)
          .get('/drugs')
          .expect(500);
  
        getDrugListTaskMock.expectExecuteWasCalledOnce();
      });
    });
  
    context('Find drug endpoint tests', () => {
      let findDrugTaskMock: FindDrugTaskMock;
  
      const drugId = 1;
      const drug = new Drug(drugId, 'Paracetamol', 'Yuriria', "Te cura el cancer", 'image1.jpg');
  
      beforeEach(() => {
        findDrugTaskMock = new FindDrugTaskMock(sandbox);
      });
  
      it('should respond 200 OK with a drug', async () => {
        findDrugTaskMock.withExecuteReturning(drug);
  
        const response = await request(app)
          .get(`/drugs/${drugId}`)
          .expect(200);
  
        expect(response.body).toEqual(drug);
        findDrugTaskMock.expectExecuteWasCalledOnceForDrug(drugId);
      });
  
      it('should respond 404 NotFound if drug does not exist', async () => {
        findDrugTaskMock.withExecuteThrowingNotFoundError();
  
        await request(app)
          .get(`/drugs/${drugId}`)
          .expect(404);
  
        findDrugTaskMock.expectExecuteWasCalledOnceForDrug(drugId);
      });
  
      it('should handle unknown errors and respond 500 Internal Server Error', async () => {
        findDrugTaskMock.withExecuteThrowingError('You shall not pass!');
  
        await request(app)
          .get(`/drugs/${drugId}`)
          .expect(500);
  
        findDrugTaskMock.expectExecuteWasCalledOnceForDrug(drugId);
      });
    });
  
    context('Add drug endpoint tests', () => {
      let addDrugTaskMock: AddDrugTaskMock;
  
      const drugData: AddDrugData = { name: 'new name', laboratory: 'new laboratory', description: "new description", image: 'newimage1.jpg' }
      const drug = new Drug(1, drugData.name, drugData.laboratory, drugData.description, drugData.image);
  
      beforeEach(() => {
        addDrugTaskMock = new AddDrugTaskMock(sandbox);
      });
  
      it('should respond 200 OK with a newly created drug', async () => {
        addDrugTaskMock.withExecuteReturning(drug);
  
        const response = await request(app)
          .post('/drugs')
          .set('Content-Type', 'application/json')
          .send(drugData)
          .expect(200);
  
        expect(response.body).toEqual(drug);
        addDrugTaskMock.expectExecuteWasCalledOnceWithDrugData(drugData);
      });
  
      it('should handle unknown errors and respond with 500 Internal Server Error', async () => {
        addDrugTaskMock.withExecuteThrowingError('What does you elf eyes see?');
  
        await request(app)
          .post('/drugs')
          .set('Content-Type', 'application/json')
          .send(drugData)
          .expect(500);
  
        addDrugTaskMock.expectExecuteWasCalledOnceWithDrugData(drugData);
      });
    });
  
    context('Update drug endpoint tests', () => {
      let updateDrugTaskMock: UpdateDrugTaskMock;
  
      const drugData: UpdateDrugData = { id: 1,  name: 'name1', laboratory: 'laboratory1', description: "description1", image: 'image1.jpg'}
      const drug = new Drug(drugData.id, drugData.name, drugData.laboratory, drugData.description, drugData.image);
  
      beforeEach(() => {
        updateDrugTaskMock = new UpdateDrugTaskMock(sandbox);
      });
  
      it('should respond 200 OK with a drug', async () => {
        updateDrugTaskMock.withExecuteReturning(drug);
  
        const response = await request(app)
          .put('/drugs')
          .set('Content-Type', 'application/json')
          .send(drugData)
          .expect(200);
  
        expect(response.body).toEqual(drug);
        updateDrugTaskMock.expectExecuteWasCalledOnceWithDrugData(drugData);
      });
  
      it('should respond 404 NotFound if drug does not exist', async () => {
        updateDrugTaskMock.withExecuteThrowingNotFoundError();
  
        await request(app)
          .put('/drugs')
          .set('Content-Type', 'application/json')
          .send(drugData)
          .expect(404);
  
        updateDrugTaskMock.expectExecuteWasCalledOnceWithDrugData(drugData);
      });
  
      it('should handle unknown errors and respond 500 Internal Server Error', async () => {
        updateDrugTaskMock.withExecuteThrowingError("They're taking the hobbits to Isengard!");
  
        await request(app)
          .put('/drugs')
          .set('Content-Type', 'application/json')
          .send(drugData)
          .expect(500);
  
        updateDrugTaskMock.expectExecuteWasCalledOnceWithDrugData(drugData);
      });
    });
  
    context('Delete drug endpoint tests', () => {
      let deleteDrugTaskMock: DeleteDrugTaskMock;
  
      const drugId = 1;
  
      beforeEach(() => {
        deleteDrugTaskMock = new DeleteDrugTaskMock(sandbox);
      });
  
      it('should respond 200 OK after deleting a drug', async () => {
        deleteDrugTaskMock.withExecuteSucceeding();
  
        await request(app)
          .delete(`/drugs/${drugId}`)
          .expect(200);
  
        deleteDrugTaskMock.expectExecuteWasCalledOnceForDrug(drugId);
      });
  
      it('should handle unknown errors and respond 500 Internal Server Error', async () => {
        deleteDrugTaskMock.withExecuteThrowingError('One does not simply walk into Mordor...');
  
        await request(app)
          .delete(`/drugs/${drugId}`)
          .expect(500);
  
        deleteDrugTaskMock.expectExecuteWasCalledOnceForDrug(drugId);
      });
    });
  });
  

