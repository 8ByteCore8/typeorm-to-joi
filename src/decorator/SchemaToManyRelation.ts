import { SchemaMetadataStorage } from '../metadata';

type Options = {
    /**
     * Default set of related entities.
     */
    dafault?: any[];

    /**
     * Count of related entities.
     */
    count?:
        | number
        | {
              /** Min count */
              min?: number;
              /** Max count */
              max?: number;
          };

    /**
     * Include related entities to schema. If is `true` includes full related entities, else - only id.
     *
     * @default false
     */
    include?: boolean;
};

/**
 * Register ManyToMany or OneToMany relation for validation.
 * @param opts Validation options.
 */
export function SchemaToManyRelation(opts?: Options): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) {
        SchemaMetadataStorage.get().relations.push({
            target: target.constructor,
            propertyName: propertyKey as string,
            default: opts?.dafault,
            count: opts?.count,
            include: opts?.include === true,
        });
    };
}
