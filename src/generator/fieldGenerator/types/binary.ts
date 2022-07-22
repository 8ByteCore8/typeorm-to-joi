import { ColumnType, DataSource } from 'typeorm';

import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import Joi from 'joi';
import { SchemaColumnMetadata } from '../../../metadata';
import { addLengthLimits } from '../utils';

/**
 * Create schema for binary field.
 * @param type Column type.
 * @param metadata Column metadata.
 * @param schemaMetadata Column validation metadata.
 * @param source Data source.
 */
export function createBinarySchema(
    type: ColumnType,
    metadata: ColumnMetadata,
    schemaMetadata: SchemaColumnMetadata,
    source: DataSource
) {
    let schema = Joi.binary();

    schema = addLengthLimits(schema, type, metadata, schemaMetadata, source);

    return schema;
}
