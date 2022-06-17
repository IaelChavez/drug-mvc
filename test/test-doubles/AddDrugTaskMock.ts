import { SinonSandbox, SinonStub, SinonStubbedInstance } from "sinon";
import * as addDrugTaskModule from "../../src/service-layer/tasks/AddDrugTask";
import Drug from "../../src/domain-layer/entities/Drug";
import expect from "expect";
import {AddDrugData} from "../../src/service-layer/tasks/AddDrugTask";

export default class AddDrugTaskMock {
    private readonly instanceStub: SinonStubbedInstance<addDrugTaskModule.default>;
  
    private readonly constructorStub: SinonStub;
  
    public constructor(sandbox: SinonSandbox) {
      this.instanceStub = sandbox.createStubInstance(addDrugTaskModule.default);
      this.constructorStub = sandbox.stub(addDrugTaskModule, 'default');
      this.constructorStub.returns(this.instanceStub);
    }
  
    public withExecuteReturning(drug: Drug): void {
      this.instanceStub.execute.returns(Promise.resolve(drug));
    }
  
    public withExecuteThrowingError(message: string): void {
      this.instanceStub.execute.throws(new Error(message));
    }
  
    public expectExecuteWasCalledOnceWithDrugData(drugData: AddDrugData): void {
      expect(this.constructorStub.calledOnce).toBe(true);
      const call = this.constructorStub.getCall(0);
      expect(call.args[0]).toEqual(drugData);
      expect(this.instanceStub.execute.calledOnce).toBe(true);
    }
  }