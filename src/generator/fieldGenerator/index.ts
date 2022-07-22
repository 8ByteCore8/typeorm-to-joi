import { ColumnType, DataSource } from 'typeorm';
import Joi, { Schema } from 'joi';

import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { Options } from '..';
import { SchemaColumnMetadata } from '../../metadata';
import { createBinarySchema } from './types/binary';
import { getDateSchema } from './types/date';
import { getNumberSchema } from './types/number';
import { getStringSchema } from './types/string';

/**
 * Create schema for field based on type.
 * @param metadata Column metadata.
 * @param schemaMetadata Column validation metadata.
 * @param source Data source.
 * @param options Validator options.
 */
export function createFieldType(
    metadata: ColumnMetadata,
    schemaMetadata: SchemaColumnMetadata,
    source: DataSource,
    options: Options
): Schema {
    let type = source.driver.normalizeType({ type: metadata.type }) as ColumnType;
    switch (type) {
        case Boolean:
        case 'bool':
        case 'boolean':
            return Joi.boolean();

        case Number:
        case 'bit':
        case 'bit varying':
        case 'int':
        case 'int2':
        case 'int4':
        case 'int8':
        case 'int64':
        case 'long':
        case 'integer':
        case 'mediumint':
        case 'rowid':
        case 'urowid':
        case 'rowversion':
        case 'smallint':
        case 'tinyint':
        case 'unsigned big int':
        case 'bigint':
        case 'number':
        case 'numeric':
        case 'smallmoney':
        case 'money':
        case 'real':
        case 'fixed':
        case 'float':
        case 'float4':
        case 'float8':
        case 'float64':
        case 'dec':
        case 'decimal':
        case 'smalldecimal':
        case 'double':
        case 'double precision':
            return getNumberSchema(type, metadata, schemaMetadata, source);

        case 'uuid':
            return Joi.string().trim().uuid();

        case Date:
        case 'date':
        case 'datetime':
        case 'datetime2':
        case 'time':
        case 'time with time zone':
        case 'time without time zone':
        case 'timestamp':
        case 'timestamp with local time zone':
        case 'timestamp with time zone':
        case 'timestamp without time zone':
        case 'timestamptz':
            return getDateSchema(type, metadata, schemaMetadata, source);

        case String:
        case 'alphanum':
        case 'char':
        case 'char varying':
        case 'character':
        case 'character varying':
        case 'citext':
        case 'line':
        case 'linestring':
        case 'longtext':
        case 'mediumtext':
        case 'multilinestring':
        case 'national char':
        case 'national varchar':
        case 'native character':
        case 'nchar':
        case 'ntext':
        case 'nclob':
        case 'nvarchar':
        case 'nvarchar2':
        case 'shorttext':
        case 'string':
        case 'text':
        case 'clob':
        case 'tinytext':
        case 'varchar':
        case 'varchar2':
        case 'varying character':
            return getStringSchema(type, metadata, schemaMetadata, source);

        case 'bfile':
        case 'binary':
        case 'bytes':
        case 'blob':
        case 'image':
        case 'raw':
        case 'long raw':
            return createBinarySchema(type, metadata, schemaMetadata, source);

        default:
            return Joi.any();
    }
}

/**
 * Generate validator for `GenaratedColumn`.
 * @param metadata Column metadata.
 * @param source Data source.
 * @param options Validator options.
 */
export function createGenaratedFieldType(metadata: ColumnMetadata, source: DataSource, options: Options): Schema {
    switch (metadata.generationStrategy) {
        case 'rowid':
        case 'increment':
            return Joi.number().integer().positive();
        case 'uuid':
            return Joi.string().trim().uuid();
        default:
            throw new Error('Invalid generation strategy.');
    }
}
