import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { UserEntity } from '@src/modules/auth/entities/user.entity';


export enum RefreshTokenStatus {
  Active = 'active',
  Revoked = 'revoked',
}

export enum BrowserType {
  // Desktop
  Chrome = 'chrome',
  Firefox = 'firefox',
  Safari = 'safari',
  Edge = 'edge',
  Opera = 'opera',

  // Mobile
  ChromeMobile = 'chrome_mobile',
  SafariMobile = 'safari_mobile',
  FirefoxMobile = 'firefox_mobile',
  SamsungInternet = 'samsung_internet',

  // In-app / WebViews
  Facebook = 'facebook',
  Instagram = 'instagram',

  // Fallback
  IE = 'ie',
  Unknown = 'unknown',
}

export enum DeviceType {
  Desktop = 'desktop',
  Mobile = 'mobile',
  Tablet = 'tablet',
  Bot = 'bot',
  Unknown = 'unknown',
}


@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: 'ip_address', length: 45 })
  ipAddress: string;

  @Column({ type: 'enum', enum: RefreshTokenStatus, default: RefreshTokenStatus.Active })
  status: RefreshTokenStatus;

  @Column({ name: 'user_agent', length: 512, nullable: true })
  userAgent?: string;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => UserEntity, (user) => user.sessions, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ name: "user_id", type: "integer" })
  userId: number;

  @Column({ name: 'browser_type', type: 'enum', enum: BrowserType, default: BrowserType.Unknown })
  browserType: BrowserType;

  @Column({ name: 'device_type', type: 'enum', enum: DeviceType, default: DeviceType.Unknown })
  deviceType: DeviceType;

  @Column({ name: 'expires', type: 'timestamptz' })
  expires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
