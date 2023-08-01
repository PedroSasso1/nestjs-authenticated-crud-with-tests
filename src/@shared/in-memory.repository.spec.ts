import { Entity } from './entity-contract';
import InMemoryRepository from './in-memory.repository';

type StubEntityProps = {
  id: number;
  name: string;
  price: number;
};

class StubEntity implements Entity {
  constructor(props: StubEntityProps) {
    Object.assign(this, props);
  }
  id: number;
  name: string;
  price: number;
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}
describe('InMemoryRepository - Unit Tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });
  it('should insert a new item', async () => {
    const entity = new StubEntity({ id: 1, name: 'test', price: 10 });
    await repository.insert(entity);
    expect(repository.items[0]).toStrictEqual(entity);
  });

  it('should throw error when entity not found', async () => {
    expect(() => repository.findById(1)).rejects.toThrow(
      new Error(`Entity not found using ID 1`),
    );
  });

  it('should find a entity by id', async () => {
    const entity = new StubEntity({ id: 1, name: 'test', price: 10 });
    await repository.insert(entity);
    const foundEntity = await repository.findById(1);
    expect(entity).toStrictEqual(foundEntity);
  });

  it('should find all entities', async () => {
    const entity = new StubEntity({ id: 1, name: 'test', price: 10 });
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toStrictEqual([entity]);
  });

  it('should throw error on update when entity not found', async () => {
    const entity = new StubEntity({ id: 1, name: 'test', price: 10 });
    expect(() => repository.update(entity)).rejects.toThrow(
      new Error(`Entity not found using ID 1`),
    );
  });

  it('should update a entity', async () => {
    const entity = new StubEntity({ id: 1, name: 'test', price: 10 });
    await repository.insert(entity);
    const updatedEntity = new StubEntity({
      id: 1,
      name: 'new test',
      price: 100,
    });
    await repository.update(updatedEntity);
    expect(updatedEntity).toStrictEqual(repository.items[0]);
  });

  it('should throw error on delete when entity not found', async () => {
    expect(() => repository.delete(1)).rejects.toThrow(
      new Error(`Entity not found using ID 1`),
    );
  });

  it('should delete a entity', async () => {
    const entity = new StubEntity({ id: 1, name: 'test', price: 10 });
    await repository.insert(entity);
    await repository.delete(1);
    expect(repository.items).toHaveLength(0);
  });
});
