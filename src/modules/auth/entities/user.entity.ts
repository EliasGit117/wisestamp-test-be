import { Column, Entity, Index, OneToMany } from "typeorm";
import { RefreshTokenEntity } from '@src/modules/auth/entities/refresh-token.entity';
import { SignatureEntity } from '@src/modules/signatures/entities/signature.entity';
import { BaseEntity } from '@src/modules/shared/entities/base.entity';

export enum UserRole {
  Admin = "admin",
  User = "user",
}

export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
}

@Index(["email"], { unique: true })
@Entity({ name: "users" })
export class UserEntity extends BaseEntity {

  @Column({ length: 256 })
  email: string;

  @Column({ name: "first_name", length: 256 })
  firstName: string;

  @Column({ name: "last_name", length: 256 })
  lastName: string;

  @Column({ length: 256 })
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.Inactive })
  status: UserStatus;


  @OneToMany(() => RefreshTokenEntity, (session) => session.user, { cascade: true })
  sessions: RefreshTokenEntity[];

  @OneToMany(() => SignatureEntity, (signature) => signature.user)
  signatures: SignatureEntity[];
}

