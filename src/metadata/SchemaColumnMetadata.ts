import { Schema } from 'joi';

/**
 * Column validation metadata.
 */
export type SchemaColumnMetadata = {
    /**
     * Column owner.
     */
    target: Function;

    /**
     * Column name.
     */
    propertyName: string;

    /**
     * User defined type validator.
     */
    type?: Schema;

    /**
     * Default field value.
     */
    default?: any;

    /**
     * Set of allowed field values.
     */
    allowed?: any[];

    /**
     * Minimal value or length.
     */
    min?: number;

    /**
     * Value must be greater.
     */
    greater?: number;

    /**
     * Max value or length.
     */
    max?: number;

    /**
     * Value must be less.
     */
    less?: number;

    /**
     * Value length.
     */
    length?: number;
};
