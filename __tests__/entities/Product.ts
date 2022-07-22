import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Category } from './Category';
import { Page } from './Page';
import { SchemaColumn } from '../../src/decorator/SchemaColumn';
import { SchemaToManyRelation } from '../../src/decorator/SchemaToManyRelation';
import { SchemaToOneRelation } from '../../src/decorator/SchemaToOneRelation';
import { Tag } from './Tag';

@Entity()
export class Product {
    @SchemaColumn()
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column(() => Page)
    public page!: Page;

    @SchemaColumn()
    @Column({
        length: 50,
    })
    public name!: string;

    @SchemaColumn()
    @Column({
        type: 'float',
        precision: 2,
        unsigned: true,
    })
    public price!: number;

    @SchemaToOneRelation()
    @ManyToOne(() => Category, (category) => category.products, { nullable: false })
    public category!: Category;

    @SchemaToManyRelation({
        include: true,
    })
    @ManyToMany(() => Tag)
    @JoinTable()
    public tags!: Tag[];
}
