import { SinonSandbox, SinonStub, SinonStubbedInstance } from 'sinon';
import * as getDrugListTaskModule from '../../../../src/service-layer/tasks/GetDrugListTask';
import Drug from '../../../../src/domain-layer/entities/Drug';
import expect from 'expect';


export default class GetDrugListTaskMock {
    private readonly instanceStub: SinonStubbedInstance<getDrugListTaskModule.default>;

    private readonly constructorStub: SinonStub;

    public constructor(sandbox: SinonSandbox){
        this.instanceStub = sandbox.createStubInstance(getDrugListTaskModule.default);
        this.constructorStub = sandbox.stub(getDrugListTaskModule, 'default');
        this.constructorStub.returns(this.instanceStub);
    }

    public withExecuteReturning(drugs: Drug[]): void {
        this.instanceStub.execute.returns(Promise.resolve(drugs));
    }

    public withExecuteThrowingError(message: string): void {
        this.instanceStub.execute.throws(new Error(message));
    }

    public expectExecuteWasCalledOnce(): void {
        expect(this.instanceStub.execute.calledOnce).toBe(true);
    }
}