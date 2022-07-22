import Joi, { Schema, SchemaLike } from 'joi';
import { SchemaColumnMetadata, SchemaMetadataStorage, SchemaRelationMetadata } from '../metadata';

import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { EntityMetadata } from 'typeorm';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { createColumnSchema } from './columns';
import { createRelationSchema } from './relations';

export { createColumnSchema } from './columns';
export { createRelationSchema } from './relations';

/**
 * Validator options.
 */
export type Options = {
    /**
     * Select Id mode.
     * In this mode validator validate only primary columns.
     * @default false
     */
    idMode: boolean;

    /**
     * Ignore included relation. All relations handle in Id mode.
     * @default false
     */
    ignoreIncludes: boolean;

    /**
     * Use mixed ids. If `true` validator validate id objects and id values. Works only for entities with not combined primary keys.
     * @exemple
     * for:
     * ```ts
     * class Product {
     *     public id!: number;
     * }
     * ```
     * valid id is
     * ```json
     * {
     *     "id":9
     * }
     * ```
     * and
     * ```json
     * 9
     * ```
     * @default false
     */
    useMixedIds: boolean;
};

/**
 * Filter entity fields and gets validation metadata from storage.
 * @param metadata Entity metadata.
 * @param metadataStorage Validation metadata storage.
 * @param options Validator options.
 */
function getColumns(
    metadata: EntityMetadata,
    metadataStorage: SchemaMetadataStorage,
    options: Options
): [ColumnMetadata, SchemaColumnMetadata][] {
    let columns: [ColumnMetadata, SchemaColumnMetadata][] = [];

    metadata.columns.forEach((column) => {
        const schemaMetadata = metadataStorage.findColumn(column);

        if (!column.relationMetadata && schemaMetadata && (options.idMode ? column.isPrimary : true))
            columns.push([column, schemaMetadata]);
    });

    return columns;
}

/**
 * Filter entity relations and gets validation metadata from storage.
 * @param metadata Entity metadata.
 * @param metadataStorage Validation metadata storage.
 * @param options Validator options.
 */
function getRelations(
    metadata: EntityMetadata,
    metadataStorage: SchemaMetadataStorage,
    options: Options
): [RelationMetadata, SchemaRelationMetadata][] {
    let relations: [RelationMetadata, SchemaRelationMetadata][] = [];

    metadata.relations.forEach((relation) => {
        const schemaMetadata = metadataStorage.findRelation(relation);

        if (schemaMetadata && (options.idMode ? relation.isPrimary : true)) relations.push([relation, schemaMetadata]);
    });

    return relations;
}

/**
 * Create validation schema for entity.
 * @param metadata Entity metadata.
 * @param opts Validator options.
 */
export function createEntitySchema(metadata: EntityMetadata, opts?: Partial<Options>): Schema {
    const options: Options = {
        idMode: opts?.idMode === true,
        ignoreIncludes: opts?.ignoreIncludes === true,
        useMixedIds: opts?.useMixedIds === true,
    };
    const keys: Record<string, SchemaLike | SchemaLike[]> = {};
    const metadataStorage = SchemaMetadataStorage.get();
    const source = metadata.connection;

    getColumns(metadata, metadataStorage, options).forEach(([column, schemaMetadata]) => {
        keys[column.propertyName] = createColumnSchema(column, schemaMetadata, source, options);
    });

    getRelations(metadata, metadataStorage, options).forEach(([relation, schemaMetadata]) => {
        keys[relation.propertyName] = createRelationSchema(relation, schemaMetadata, source, options);
    });

    if (options.useMixedIds && options.idMode && Object.keys(keys).length === 1)
        return Joi.alternatives(Joi.object(keys), Object.values(keys)[0]);
    return Joi.object(keys);
}
