import { SinonSandbox, SinonStub, SinonStubbedInstance } from "sinon";
import DatabaseConnection from "../../../../src/persistence-layer/DatabaseConnection";
import { EntityTarget } from "typeorm";
import expect from "expect";

export default class DatabaseConnectionMock {
    private readonly instanceStub: SinonStubbedInstance<DatabaseConnection>;

    private readonly getInstanceStub: SinonStub;

    private readonly repositoryFakes: {
        find: SinonStub;
        findOneBy: SinonStub;
        save: SinonStub;
        delete: SinonStub;
    };

    public constructor(sandbox: SinonSandbox) {
        this.instanceStub = sandbox.createStubInstance(DatabaseConnection);
        this.getInstanceStub = sandbox.stub(DatabaseConnection, 'getInstance');
        this.getInstanceStub.returns(this.instanceStub);
        this.repositoryFakes = {
            find: sandbox.stub(),
            findOneBy: sandbox.stub(),
            save: sandbox.stub(),
            delete: sandbox.stub(),
        }
        this.instanceStub.getRepository.returns(this.repositoryFakes as any);
    }

    public withFindReturningListOfEntities<Entity>(entities: Entity[]): void {
        this.repositoryFakes.find.returns(Promise.resolve(entities));
    }
    
    public withFindOneByReturningEntity<Entity>(entity: Entity): void {
        this.repositoryFakes.findOneBy.returns(Promise.resolve(entity));
    }
    
    public withSaveReturningEntity<Entity>(entity: Entity): void {
        this.repositoryFakes.save.returns(Promise.resolve(entity));
    }
    
    public withDeleteSucceeding(): void {
        this.repositoryFakes.delete.returns(Promise.resolve());
    }
    
    public expectGotRepositoryOf<Entity>(target: EntityTarget<Entity>): void {
        expect(this.instanceStub.getRepository.calledOnce).toBe(true);
        const call = this.instanceStub.getRepository.getCall(0);
        expect(call.args[0]).toEqual(target);
    }
    
    public expectFindCalledOnce(): void {
        expect(this.repositoryFakes.find.calledOnce).toBe(true);
    }
    
    public expectFindOneByCalledOnceWith<FindOptions>(options: FindOptions): void {
        expect(this.repositoryFakes.findOneBy.calledOnce).toBe(true);
        const call = this.repositoryFakes.findOneBy.getCall(0);
        expect(call.args[0]).toEqual(options);
    }
    
    public expectSaveCalledOnceWith<DataType>(data: DataType): void {
        expect(this.repositoryFakes.save.calledOnce).toBe(true);
        const call = this.repositoryFakes.save.getCall(0);
        expect(call.args[0]).toEqual(data);
    }
    
    public expectDeleteCalledOnceWith<PrimaryKeyType>(primaryKey: PrimaryKeyType): void {
        expect(this.repositoryFakes.delete.calledOnce).toBe(true);
        const call = this.repositoryFakes.delete.getCall(0);
        expect(call.args[0]).toEqual(primaryKey);
    }
}