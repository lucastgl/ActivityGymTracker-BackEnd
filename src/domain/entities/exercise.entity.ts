import { Id } from '../value-objects/id.vo';
import { MuscleCategory } from '../enums/muscle-category.enum';
import { Equipment } from '../enums/equipment.enum';
import { SideType } from '../enums/side-type.enum';

export class Exercise {
  constructor(
    public readonly id: Id,
    public readonly userId: Id,
    public readonly name: string,
    public readonly category: MuscleCategory,
    public readonly equipment: Equipment,
    public readonly sideType: SideType,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
