import { Schema } from 'joi';
import { SchemaMetadataStorage } from '../metadata';

type Options = {
    /**
     * Value validation. Used for data value validation.
     *
     * !IMPORTANT: If this options is selected all other value options ignored.
     */
    type?: Schema;

    /**
     * Length of `string`, `buffer` and `array`. Must be less or equil then `length` option in `Column` and greater or equil `0`.
     *
     * !IMPORTANT: Conflict with `min` and `max` options.
     *
     * !IMPORTANT: If `length` option in `Column` not defined, as length gets default value from driver.
     * * For `string` in `postgress` its `256` characters.
     * * For `string` in `sqlite` its `undefined`, or `0` characters.
     */
    length?: number;

    /**
     * Min value/length.
     *
     * * For `number` - minimal allowed value.
     * * For `string`, `buffer` and `array` - minimal allowed length, must be less or equil then `length` option in `Column`.
     *
     * !IMPORTANT: @see 'length' option.
     */
    min?: number;

    /**
     * Max value/length.
     *
     * * For `number` - maximal allowed value.
     * * For `string`, `buffer` and `array` - maximal allowed length, must be less or equil then `length` option in `Column`. By default is `length` option from `Column`.
     *
     * !IMPORTANT: @see 'length' option.
     */
    max?: number;

    /**
     * Value must be greater then...
     * Used for Numbers and Date.
     */
    greater?: number;

    /**
     * Value must be less then...
     * Used for Numbers and Date.
     */
    less?: number;

    /**
     * Default value.
     */
    dafault?: any;

    /**
     * Allowed values.
     */
    allowed?: any[];
};

/**
 * Register field for validation.
 * @param opts Validation options.
 */
export function SchemaColumn(opts?: Options): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) {
        SchemaMetadataStorage.get().columns.push({
            target: target.constructor,
            propertyName: propertyKey as string,
            type: opts?.type,
            allowed: opts?.allowed,
            default: opts?.dafault,
            max: opts?.max,
            min: opts?.min,
            greater: opts?.greater,
            less: opts?.less,
        });
    };
}
