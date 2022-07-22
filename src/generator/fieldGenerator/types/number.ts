import { ColumnType, DataSource } from 'typeorm';

import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import Joi from 'joi';
import { SchemaColumnMetadata } from '../../../metadata';

/**
 * Create schema for number field.
 * @param type Column type.
 * @param metadata Column metadata.
 * @param schemaMetadata Column validation metadata.
 * @param source Data source.
 */
export function getNumberSchema(
    type: ColumnType,
    metadata: ColumnMetadata,
    schemaMetadata: SchemaColumnMetadata,
    source: DataSource
) {
    let schema = Joi.number();

    if (metadata.unsigned) schema = schema.positive();

    if (
        source.driver.withPrecisionColumnTypes.includes(type) &&
        typeof metadata.precision === 'number' &&
        metadata.precision > 0
    )
        schema = schema.precision(metadata.precision);
    else schema = schema.integer();

    if (schemaMetadata.max) schema = schema.max(schemaMetadata.max);
    else if (schemaMetadata.greater) schema = schema.greater(schemaMetadata.greater);

    if (schemaMetadata.min) schema = schema.min(schemaMetadata.min);
    else if (schemaMetadata.less) schema = schema.less(schemaMetadata.less);

    return schema;
}
