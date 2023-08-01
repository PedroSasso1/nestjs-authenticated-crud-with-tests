import { Entity } from './entity-contract';
import { RepositoryInterface } from './repository-contracts';

export default abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async findById(id: number): Promise<E> {
    return this._get(id);
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  async update(entity: E): Promise<void> {
    await this._get(entity.id);
    const indexFound = this.items.findIndex((i) => i.id === entity.id);
    this.items[indexFound] = entity;
  }

  async delete(id: number): Promise<void> {
    await this._get(id);
    const indexFound = this.items.findIndex((i) => i.id === id);
    this.items.splice(indexFound, 1);
  }

  protected async _get(id: number) {
    const item = this.items.find((item) => item.id === id);
    if (!item) {
      throw new Error(`Entity not found using ID ${id}`);
    }
    return item;
  }
}
