/**
 * Relation validation metadata
 */
export type SchemaRelationMetadata = {
    /**
     * Field owner.
     */
    target: Function;

    /**
     * Field name.
     */
    propertyName: string;

    /**
     * Count of related entities.
     */
    count?:
        | number
        | {
              /**
               * Minimum count of relatid entities.
               */
              min?: number;

              /**
               * Maximum count of relatid entities.
               */
              max?: number;
          };

    /**
     * Default related entity/entities.
     */
    default?: any | any[];

    /**
     * Include relation in validation schema.
     */
    include: boolean;
};
