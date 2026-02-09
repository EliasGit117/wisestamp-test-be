import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { BaseEntity } from "../../shared/entities/base.entity";
import { SignatureEntity } from "./signature.entity";

@Entity({ name: "generated_signatures" })
@Index(["signatureId"], { unique: true })
export class GeneratedSignatureEntity extends BaseEntity {

  @OneToOne(() => SignatureEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "signature_id" })
  signature: SignatureEntity;

  @Column({ name: "signature_id" })
  signatureId: number;

  @Column({ type: "text" })
  html: string;

  @Column({ type: "text" })
  text: string;
}