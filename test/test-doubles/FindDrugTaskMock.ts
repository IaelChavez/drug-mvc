import { SinonSandbox, SinonStub, SinonStubbedInstance } from "sinon";
import * as findDrugTaskModule from "../../src/service-layer/tasks/FindDrugTask";
import Drug from "../../src/domain-layer/entities/Drug";
import expect from "expect";

export default class FindDrugTaskMock {
  private readonly instanceStub: SinonStubbedInstance<findDrugTaskModule.default>;

  private readonly constructorStub: SinonStub;

  public constructor(sandbox: SinonSandbox) {
    this.instanceStub = sandbox.createStubInstance(findDrugTaskModule.default);
    this.constructorStub = sandbox.stub(findDrugTaskModule, 'default');
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

  public expectExecuteWasCalledOnceForDrug(drugId: number): void {
    expect(this.constructorStub.calledOnce).toBe(true);
    const call = this.constructorStub.getCall(0);
    expect(call.args[0]).toBe(drugId);
    expect(this.instanceStub.execute.calledOnce).toBe(true);
  }
}