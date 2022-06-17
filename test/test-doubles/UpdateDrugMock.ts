import { SinonSandbox, SinonStub, SinonStubbedInstance } from "sinon";
import * as updateDrugTaskModule from "../../src/service-layer/tasks/UpdateDrugTask";
import Drug from "../../src/domain-layer/entities/Drug";
import expect from "expect";
import { UpdateDrugData } from "../../src/service-layer/tasks/UpdateDrugTask";

export default class UpdateDrugTaskMock {
  private readonly instanceStub: SinonStubbedInstance<updateDrugTaskModule.default>;

  private readonly constructorStub: SinonStub;

  public constructor(sandbox: SinonSandbox) {
    this.instanceStub = sandbox.createStubInstance(updateDrugTaskModule.default);
    this.constructorStub = sandbox.stub(updateDrugTaskModule, 'default');
    this.constructorStub.returns(this.instanceStub);
  }

  public withExecuteReturning(drug: Drug): void {
    this.instanceStub.execute.returns(Promise.resolve(drug));
  }

  public withExecuteThrowingNotFoundError(): void {
    this.instanceStub.execute.throws(new Error('Drug not found.'));
  }

  public withExecuteThrowingError(message: string): void {
    this.instanceStub.execute.throws(new Error(message));
  }

  public expectExecuteWasCalledOnceWithDrugData(drugData: UpdateDrugData): void {
    expect(this.constructorStub.calledOnce).toBe(true);
    const call = this.constructorStub.getCall(0);
    expect(call.args[0]).toEqual(drugData);
    expect(this.instanceStub.execute.calledOnce).toBe(true);
  }
}