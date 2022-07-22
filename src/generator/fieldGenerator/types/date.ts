import { ColumnType, DataSource } from 'typeorm';

import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import Joi from 'joi';
import { SchemaColumnMetadata } from '../../../metadata';

/**
 * Create schema for date field.
 * @param type Column type.
 * @param metadata Column metadata.
 * @param schemaMetadata Column validation metadata.
 * @param source Data source.
 */
export function getDateSchema(
    type: ColumnType,
    metadata: ColumnMetadata,
    schemaMetadata: SchemaColumnMetadata,
    source: DataSource
) {
    let schema = Joi.date();

    if (schemaMetadata.max) schema = schema.max(schemaMetadata.max);
    else if (schemaMetadata.greater) schema = schema.greater(schemaMetadata.greater);

    if (schemaMetadata.min) schema = schema.min(schemaMetadata.min);
    else if (schemaMetadata.less) schema = schema.less(schemaMetadata.less);

    return schema;
}
