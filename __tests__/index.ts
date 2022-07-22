import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { Product } from './entities/Product';
import { createEntitySchema } from '../src/generator';
import { join } from 'path';

async function main() {
    const ds = await new DataSource({
        type: 'better-sqlite3',
        database: 'test.sqlite',
        entities: [join('entities', '**/*.{ts,js}')],
    }).initialize();

    const productRepository = ds.getRepository(Product);
    let product = productRepository.create();

    console.log('ID:', JSON.stringify(createEntitySchema(productRepository.metadata, { idMode: true }).describe()));
    console.log('FULL:', JSON.stringify(createEntitySchema(productRepository.metadata).describe()));
    console.log('IHNORE INCLUDES:', JSON.stringify(createEntitySchema(productRepository.metadata, { ignoreIncludes: true }).describe()));

    product = await createEntitySchema(productRepository.metadata).validateAsync(product, {
        stripUnknown: true,
        convert: true,
        abortEarly: false,
    });

    console.log(product);
}

main();
