import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";
import { BaseEntity } from "../../shared/entities/base.entity";
import { UserEntity } from '@src/modules/auth/entities/user.entity';


export enum SignatureStatus {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  Failed = "failed",
}

@Entity({ name: "signatures" })
@Index(["status"])
@Index(["user"])
export class SignatureEntity extends BaseEntity {

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: "CASCADE" })
  user: UserEntity;

  @Column({ name: "template_id", length: 100 })
  templateId: string;

  @Column({ type: "jsonb" })
  payload: Record<string, unknown>;

  @Column({ type: "text", nullable: true })
  html: string | null;

  @Column({ type: "text", nullable: true })
  text: string | null;

  @Column({ type: "varchar",  name: "webhook_url", length: 500, nullable: true })
  webhookUrl: string | null;

  @Column({ type: "enum", enum: SignatureStatus, default: SignatureStatus.Pending })
  status: SignatureStatus;

  @Column({ name: "error_message", type: "text", nullable: true })
  errorMessage: string | null;

  @Column({ type: "int", default: 0 })
  attempts: number;
}