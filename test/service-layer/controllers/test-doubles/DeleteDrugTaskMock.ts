import { SinonSandbox, SinonStub, SinonStubbedInstance } from "sinon";
import * as deleteDrugTaskModule from "../../../../src/service-layer/tasks/DeleteDrugTask"
import expect from 'expect';

export default class DeleteDrugTaskMock {
    private readonly instanceStub: SinonStubbedInstance<deleteDrugTaskModule.default>;

    private readonly constructorStub: SinonStub;

    public constructor(sandbox: SinonSandbox) {
        this.instanceStub = sandbox.createStubInstance(deleteDrugTaskModule.default);
        this.constructorStub = sandbox.stub(deleteDrugTaskModule, 'default');
        this.constructorStub.returns(this.instanceStub);
    }

    public withExecuteSucceeding(): void {
        this.instanceStub.execute.returns(Promise.resolve());
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