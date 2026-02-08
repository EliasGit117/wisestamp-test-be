import {
  Column,
  Entity,
  Index, JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from "../../shared/entities/base.entity";
import { UserEntity } from '@src/modules/auth/entities/user.entity';


export enum SignatureTemplateId {
  SimpleGreen = "simple-green",
  LightSquared = "light-squared",
}

@Entity({ name: "signatures" })
@Index(["user"])
export class SignatureEntity extends BaseEntity {

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => UserEntity, (user) => user.signatures, { nullable: false, onDelete: "CASCADE" })
  user: UserEntity;

  @Column({ name: "user_id", type: "integer" })
  userId: number;

  @Column({ name: "template_id", type: "enum", enum: SignatureTemplateId })
  templateId: SignatureTemplateId;

  @Column({ type: "jsonb" })
  payload: Record<string, string>;
}
