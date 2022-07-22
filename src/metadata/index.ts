import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import { SchemaColumnMetadata } from './SchemaColumnMetadata';
import { SchemaRelationMetadata } from './SchemaRelationMetadata';

export { SchemaColumnMetadata } from './SchemaColumnMetadata';
export { SchemaRelationMetadata } from './SchemaRelationMetadata';

/**
 * Validation metadata storage.
 */
export class SchemaMetadataStorage {
    /**
     * Storage instance.
     */
    private static _instance?: SchemaMetadataStorage;

    /**
     * Get Storage instance.
     */
    public static get(): SchemaMetadataStorage {
        if (!SchemaMetadataStorage._instance) SchemaMetadataStorage._instance = new SchemaMetadataStorage();
        return SchemaMetadataStorage._instance;
    }

    /**
     * Column validation metadatas.
     */
    columns: SchemaColumnMetadata[] = [];

    /**
     * Relation validation metadatas.
     */
    relations: SchemaRelationMetadata[] = [];

    /**
     * Find column validation metadata.
     * @param metadata Column metadata.
     */
    public findColumn(metadata: ColumnMetadata): SchemaColumnMetadata | undefined {
        for (const column of this.columns)
            if (column.target === metadata.target && column.propertyName === metadata.propertyName) return column;
        return undefined;
    }

    /**
     * Find relation validation metadata.
     * @param metadata Relation metadata.
     */
    public findRelation(metadata: RelationMetadata): SchemaRelationMetadata | undefined {
        for (const relation of this.relations)
            if (relation.target === metadata.target && relation.propertyName === metadata.propertyName) return relation;

        return undefined;
    }
}
