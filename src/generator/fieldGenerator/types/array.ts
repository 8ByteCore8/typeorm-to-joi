// import { ColumnType, DataSource } from "typeorm";

// import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
// import Joi from "joi";
// import { SchemaColumnMetadata } from "../../../../metadata";

// export function getArraySchema(type: ColumnType, metadata: ColumnMetadata, schemaMetadata: SchemaColumnMetadata, source: DataSource) {
//     let schema = Joi.array().items();

//     if (source.driver.withLengthColumnTypes.includes(type)) {
//         let length = Number(metadata.length);
//         if (!Number.isNaN(length) && Number.isFinite(length) && Number.isInteger(length)) {
//             if (length === 0 && source.driver.dataTypeDefaults[metadata.type as string].length !== undefined)
//                 length = source.driver.dataTypeDefaults[metadata.type as string].length!;

//             schema = schema.max(length);
//         }
//     }
//     return schema;
// }
