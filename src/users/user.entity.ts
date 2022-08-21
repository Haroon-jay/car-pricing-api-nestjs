import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';
import { createWriteStream } from 'fs';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 500, nullable: false, unique: true })
  email: string;
  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    const stream = createWriteStream('signup-logs.txt', { flags: 'a' });
    stream.write('User Inserted with id ' + this.id + '\n');
  }

  @AfterRemove()
  afterRemove() {
    console.log('User Removed with id ' + this.id);
  }
  @AfterUpdate()
  afterUpdate() {
    console.log('User Updated with id ' + this.id);
  }
}
