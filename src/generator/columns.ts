import { createFieldType, createGenaratedFieldType } from './fieldGenerator';

import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { DataSource } from 'typeorm';
import { Options } from '.';
import { Schema } from 'joi';
import { SchemaColumnMetadata } from '../metadata';

/**
 * Get field type validator.
 * @param metadata Column metadata.
 * @param schemaMetadata Column validation metadata.
 * @param source Data source.
 * @param options Validator options.
 */
function getFieldType(
    metadata: ColumnMetadata,
    schemaMetadata: SchemaColumnMetadata,
    source: DataSource,
    options: Options
): Schema {
    if (schemaMetadata.type !== undefined) return schemaMetadata.type;
    else if (metadata.isGenerated && metadata.generationStrategy !== undefined)
        return createGenaratedFieldType(metadata, source, options);
    else return createFieldType(metadata, schemaMetadata, source, options);
}

/**
 * Create filed validator.
 * @param metadata Column metadata.
 * @param schemaMetadata Column validation metadata.
 * @param source Data source.
 * @param options Validator options.
 */
export function createColumnSchema(
    metadata: ColumnMetadata,
    schemaMetadata: SchemaColumnMetadata,
    source: DataSource,
    options: Options
): Schema {
    let schema = getFieldType(metadata, schemaMetadata, source, options);

    if (metadata.isNullable || (metadata.isGenerated && !(options.idMode && metadata.isPrimary)))
        schema = schema.optional().default(null).allow(null);
    else schema = schema.required();

    if (schemaMetadata.default !== undefined) schema = schema.default(schemaMetadata.default);

    if (schemaMetadata.allowed !== undefined) schema = schema.allow(schemaMetadata.allowed);

    return schema;
}
