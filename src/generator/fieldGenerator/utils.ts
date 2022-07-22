import { ArraySchema, BinarySchema, StringSchema } from 'joi';
import { ColumnType, DataSource } from 'typeorm';

import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { SchemaColumnMetadata } from '../../metadata';

type SchemaWithLength = StringSchema | ArraySchema | BinarySchema;

/**
 * Add length limit for same parameter.
 * @param schema Field schema.
 * @param length Length limit.
 * @param columnLength Max length limit.
 * @param parameter Name of parameter.
 */
function addLengthLimit<T extends SchemaWithLength>(
    schema: T,
    length: number,
    columnLength: number,
    parameter: 'min' | 'max' | 'length'
): T {
    if (length > columnLength) return schema[parameter](columnLength) as T;
    else if (length < 0) return schema[parameter](0) as T;
    else return schema[parameter](length) as T;
}

/**
 * Gets column length parameter from `Column` option or from driver defaults.
 * @param type Column type.
 * @param metadata Column metadata.
 * @param source Data source.
 */
function getColumnLength(type: ColumnType, metadata: ColumnMetadata, source: DataSource) {
    let length = Number(metadata.length);

    if (Number.isInteger(length)) return length;
    else if (
        source.driver.dataTypeDefaults !== undefined &&
        source.driver.dataTypeDefaults[type as string] !== undefined &&
        source.driver.dataTypeDefaults[type as string].length !== undefined
    )
        return Number(source.driver.dataTypeDefaults[type as string].length);
    else return 0;
}

/**
 * Add length limit for field.
 * @param schema Field schema.
 * @param type Column type.
 * @param metadata Column metadata.
 * @param schemaMetadata Column validation metadata.
 * @param source Data source.
 */
export function addLengthLimits<T extends SchemaWithLength>(
    schema: T,
    type: ColumnType,
    metadata: ColumnMetadata,
    schemaMetadata: SchemaColumnMetadata,
    source: DataSource
): T {
    const columnLength = getColumnLength(type, metadata, source);

    if (schemaMetadata.length) return addLengthLimit(schema, schemaMetadata.length, columnLength, 'length');
    else if (schemaMetadata.min || schemaMetadata.max) {
        if (schemaMetadata.min) schema = addLengthLimit(schema, schemaMetadata.min, columnLength, 'min');
        else schema = addLengthLimit(schema, 0, columnLength, 'min');

        if (schemaMetadata.max) schema = addLengthLimit(schema, schemaMetadata.max, columnLength, 'max');
        else schema = addLengthLimit(schema, columnLength, columnLength, 'max');
        return schema;
    } else return schema.min(0).max(columnLength) as T;
}
