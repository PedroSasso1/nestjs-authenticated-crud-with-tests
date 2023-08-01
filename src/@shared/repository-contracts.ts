export interface RepositoryInterface<Entity> {
  insert(entity: Entity): Promise<void>;
  findById(id: number): Promise<Entity>;
  findAll(): Promise<Entity[]>;
  update(entity: Entity): Promise<void>;
  delete(id: number): Promise<void>;
}
