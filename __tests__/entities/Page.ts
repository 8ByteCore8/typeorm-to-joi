import { Column } from 'typeorm';
import { SchemaColumn } from '../../src/decorator/SchemaColumn';

export class Page {
    @SchemaColumn({
        min: 10,
    })
    @Column({
        length: 100,
    })
    public title!: string;

    @SchemaColumn({
        min: 50,
    })
    @Column({
        length: 200,
    })
    public description!: string;
}
