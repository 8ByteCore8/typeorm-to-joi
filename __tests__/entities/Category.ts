import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './Product';
import { SchemaColumn } from '../../src/decorator/SchemaColumn';
import { SchemaToManyRelation } from '../../src/decorator/SchemaToManyRelation';

@Entity()
export class Category {
    @SchemaColumn()
    @PrimaryGeneratedColumn()
    public id!: number;

    @SchemaColumn()
    @Column({
        length: 50,
    })
    public name!: string;

    @SchemaColumn()
    @Column({
        length: 200,
    })
    public description!: string;

    @SchemaToManyRelation()
    @OneToMany(() => Product, (product) => product.category)
    public products!: Product[];
}
