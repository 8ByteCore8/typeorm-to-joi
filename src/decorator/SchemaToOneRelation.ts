import { SchemaMetadataStorage } from '../metadata';

type Options = {
    // INFO: Подумать над целисообразностью данного параметра.
    /**
     * Default related entity.
     */
    dafault?: any;

    /**
     * Include related entity to schema. If is `true` includes full related entity, else - only id.
     *
     * @default false
     */
    include?: boolean;
};

/**
 * Register ManyToMany or OneToMany relation for validation.
 * @param opts Validation options.
 */
export function SchemaToOneRelation(opts?: Options): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) {
        SchemaMetadataStorage.get().relations.push({
            target: target.constructor,
            propertyName: propertyKey as string,
            default: opts?.dafault,
            include: opts?.include === true,
        });
    };
}
