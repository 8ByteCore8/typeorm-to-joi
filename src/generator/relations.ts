import Joi, { Schema } from 'joi';
import { Options, createEntitySchema } from '.';

import { DataSource } from 'typeorm';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { SchemaRelationMetadata } from '../metadata';

/**
 * Create schema for OneToOne and ManyToOne relations.
 * @param metadata Relation metadata.
 * @param schemaMetadata Relation validation metadata.
 * @param source Data source.
 * @param options Validator options.
 */
function createToOneRelationSchema(
    metadata: RelationMetadata,
    schemaMetadata: SchemaRelationMetadata,
    source: DataSource,
    options: Options
): Schema {
    let schema = createEntitySchema(metadata.inverseEntityMetadata, {
        ...options,
        idMode: !schemaMetadata.include || options.idMode || options.ignoreIncludes,
    });

    if (metadata.isNullable) schema = schema.optional().default(null).allow(null);
    else schema = schema.required();

    return schema;
}

/**
 * Create schema for OneToMany and ManyToMany relations.
 * @param metadata Relation metadata.
 * @param schemaMetadata Relation validation metadata.
 * @param source Data source.
 * @param options Validator options.
 */
function createToManyRelationSchema(
    metadata: RelationMetadata,
    schemaMetadata: SchemaRelationMetadata,
    source: DataSource,
    options: Options
): Schema {
    let schema = Joi.array()
        .items(
            createEntitySchema(metadata.inverseEntityMetadata, {
                ...options,
                idMode: !schemaMetadata.include || options.idMode || options.ignoreIncludes,
            }).required()
        )
        .default([]);

    if (typeof schemaMetadata.count === 'number') schema = schema.length(schemaMetadata.count);
    else if (typeof schemaMetadata.count === 'object') {
        if (schemaMetadata.count.min) schema = schema.min(schemaMetadata.count.min);
        if (schemaMetadata.count.max) schema = schema.max(schemaMetadata.count.max);
    }

    return schema;
}

/**
 * Create schema for entity relations.
 * @param metadata Relation metadata.
 * @param schemaMetadata Relation validation metadata.
 * @param source Data source.
 * @param options Validator options.
 */
export function createRelationSchema(
    metadata: RelationMetadata,
    schemaMetadata: SchemaRelationMetadata,
    source: DataSource,
    options: Options
): Schema {
    let schema: Schema;
    if (metadata.isManyToMany || metadata.isOneToMany)
        schema = createToManyRelationSchema(metadata, schemaMetadata, source, options);
    else if (metadata.isManyToOne || metadata.isOneToOne)
        schema = createToOneRelationSchema(metadata, schemaMetadata, source, options);
    else throw new Error('Invalid relation type');

    if (schemaMetadata.default !== undefined) schema = schema.default(schemaMetadata.default);

    return schema;
}
