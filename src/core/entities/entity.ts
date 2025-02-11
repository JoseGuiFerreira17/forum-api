import { randomUUID } from 'node:crypto';
import { UniqueEntityId } from './unique-entity-id';

export abstract class Entity<Props> {
  private _id: UniqueEntityId;
  protected props: Props;

  get id(): UniqueEntityId {
    return this._id;
  }

  protected constructor(props: any, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId(id);
  }

  public equals(entity: Entity<any>) {
    if (this === entity) {
      return true;
    }

    if (entity.id === this._id) {
      return true;
    }

    return false;
  }
}
