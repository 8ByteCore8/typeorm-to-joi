import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { SchemaColumn } from '../../src/decorator/SchemaColumn';

@Entity()
export class Tag {
    @SchemaColumn()
    @PrimaryGeneratedColumn()
    public id!: number;

    @SchemaColumn()
    @Column({
        length: 50,
    })
    public name!: string;
}
