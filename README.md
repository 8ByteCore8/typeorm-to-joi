# 1. Content

-   [1. Content](#1-content)
-   [2. Description](#2-description)
-   [3. Usage](#3-usage)
    -   [3.1. Create TypeORM entities](#31-create-typeorm-entities)
    -   [3.2. Add decorators](#32-add-decorators)
    -   [3.3. Use in code](#33-use-in-code)
        -   [3.3.1. Get entity metadata](#331-get-entity-metadata)
            -   [3.3.1.1. From DataSource](#3311-from-datasource)
            -   [3.3.1.2. From Repository](#3312-from-repository)
        -   [3.3.2. Schema for entity id](#332-schema-for-entity-id)
        -   [3.3.3. Schema for full entity with includes](#333-schema-for-full-entity-with-includes)
        -   [3.3.4. Schema for full entity without includes](#334-schema-for-full-entity-without-includes)
        -   [3.3.5. Validation](#335-validation)

# 2. Description

Lib for gnerate Joi validation schema for TypeORM entities.

# 3. Usage

## 3.1. Create TypeORM entities

Category.ts

```ts
@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({
        length: 50,
    })
    public name!: string;

    @Column({
        length: 200,
    })
    public description!: string;

    @OneToMany(() => Product, (product) => product.category)
    public products!: Product[];
}
```

Page.ts

```ts
export class Page {
    @Column({
        length: 100,
    })
    public title!: string;

    @Column({
        length: 200,
    })
    public description!: string;
}
```

Product.ts

```ts
@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column(() => Page)
    public page!: Page;

    @Column({
        length: 50,
    })
    public name!: string;

    @Column({
        type: 'float',
        precision: 2,
        unsigned: true,
    })
    public price!: number;

    @ManyToOne(() => Category, (category) => category.products, {
        nullable: false,
    })
    public category!: Category;

    @ManyToMany(() => Tag)
    @JoinTable()
    public tags!: Tag[];
}
```

Tag.ts

```ts
@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({
        length: 50,
    })
    public name!: string;
}
```

## 3.2. Add decorators

NOTE: For embeds decorator not needed. TypeORM compile embeds into table as plant.
NOTE: TypeORM has 4 relation types: OneToOne, OneToMany, ManyToOne, ManyToMany.
But lib has 2 relation types:

-   ToOne (for handle OneToOne, ManyToOne)
-   ToMany(for handle OneToMany, ManyToMany)

Category.ts

```ts
@Entity()
export class Category {
    @SchemaColumn()
    @PrimaryGeneratedColumn()
    public id!: number;

    @SchemaColumn()
    @Column({
        length: 50,
    })
    public name!: string;

    @SchemaColumn()
    @Column({
        length: 200,
    })
    public description!: string;

    @SchemaToManyRelation()
    @OneToMany(() => Product, (product) => product.category)
    public products!: Product[];
}
```

Page.ts

```ts
export class Page {
    @SchemaColumn({
        min: 10,
    })
    @Column({
        length: 100,
    })
    public title!: string;

    @SchemaColumn({
        min: 50,
    })
    @Column({
        length: 200,
    })
    public description!: string;
}
```

Product.ts

```ts
@Entity()
export class Product {
    @SchemaColumn()
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column(() => Page)
    public page!: Page;

    @SchemaColumn()
    @Column({
        length: 50,
    })
    public name!: string;

    @SchemaColumn()
    @Column({
        type: 'float',
        precision: 2,
        unsigned: true,
    })
    public price!: number;

    @SchemaToOneRelation()
    @ManyToOne(() => Category, (category) => category.products, {
        nullable: false,
    })
    public category!: Category;

    @SchemaToManyRelation({
        include: true,
    })
    @ManyToMany(() => Tag)
    @JoinTable()
    public tags!: Tag[];
}
```

Tag.ts

```ts
@Entity()
export class Tag {
    @SchemaColumn()
    @PrimaryGeneratedColumn()
    public id!: number;

    @SchemaColumn()
    @Column({
        length: 50,
    })
    public name!: string;
}
```

## 3.3. Use in code

### 3.3.1. Get entity metadata

#### 3.3.1.1. From DataSource

```ts
const productMetadata = dataSource.getMetadata(Product);
```

#### 3.3.1.2. From Repository

```ts
const productRepository = dataSource.getRepository(Product);
const productMetadata = productRepository.metadata;
```

### 3.3.2. Schema for entity id

```ts
const productSchema = getEntitySchema(productMetadata, { idMode: true });
```

Generated schema:

```json
{
    "type": "alternatives",
    "matches": [
        {
            "schema": {
                "type": "object",
                "keys": {
                    "id": {
                        "type": "number",
                        "flags": { "presence": "required" },
                        "rules": [{ "name": "integer" }, { "name": "sign", "args": { "sign": "positive" } }]
                    }
                }
            }
        },
        {
            "schema": {
                "type": "number",
                "flags": { "presence": "required" },
                "rules": [{ "name": "integer" }, { "name": "sign", "args": { "sign": "positive" } }]
            }
        }
    ]
}
```

### 3.3.3. Schema for full entity with includes

```ts
const productSchema = getEntitySchema(productMetadata);
```

Generated schema:

```json
{
    "type": "object",
    "keys": {
        "id": {
            "type": "number",
            "flags": { "presence": "optional", "default": null },
            "rules": [{ "name": "integer" }, { "name": "sign", "args": { "sign": "positive" } }],
            "allow": [null]
        },
        "name": {
            "type": "string",
            "flags": { "presence": "required" },
            "rules": [
                { "name": "trim", "args": { "enabled": true } },
                { "name": "min", "args": { "limit": 0 } },
                { "name": "max", "args": { "limit": 50 } }
            ]
        },
        "price": {
            "type": "number",
            "flags": { "presence": "required" },
            "rules": [
                { "name": "sign", "args": { "sign": "positive" } },
                { "name": "precision", "args": { "limit": 2 } }
            ]
        },
        "title": {
            "type": "string",
            "flags": { "presence": "required" },
            "rules": [
                { "name": "trim", "args": { "enabled": true } },
                { "name": "min", "args": { "limit": 10 } },
                { "name": "max", "args": { "limit": 100 } }
            ]
        },
        "description": {
            "type": "string",
            "flags": { "presence": "required" },
            "rules": [
                { "name": "trim", "args": { "enabled": true } },
                { "name": "min", "args": { "limit": 50 } },
                { "name": "max", "args": { "limit": 200 } }
            ]
        },
        "category": {
            "type": "alternatives",
            "flags": { "presence": "required" },
            "matches": [
                {
                    "schema": {
                        "type": "object",
                        "keys": {
                            "id": {
                                "type": "number",
                                "flags": { "presence": "required" },
                                "rules": [
                                    { "name": "integer" },
                                    {
                                        "name": "sign",
                                        "args": { "sign": "positive" }
                                    }
                                ]
                            }
                        }
                    }
                },
                {
                    "schema": {
                        "type": "number",
                        "flags": { "presence": "required" },
                        "rules": [{ "name": "integer" }, { "name": "sign", "args": { "sign": "positive" } }]
                    }
                }
            ]
        },
        "tags": {
            "type": "array",
            "flags": { "default": [] },
            "items": [
                {
                    "type": "object",
                    "flags": { "presence": "required" },
                    "keys": {
                        "id": {
                            "type": "number",
                            "flags": {
                                "presence": "optional",
                                "default": null
                            },
                            "rules": [
                                { "name": "integer" },
                                {
                                    "name": "sign",
                                    "args": { "sign": "positive" }
                                }
                            ],
                            "allow": [null]
                        },
                        "name": {
                            "type": "string",
                            "flags": { "presence": "required" },
                            "rules": [
                                { "name": "trim", "args": { "enabled": true } },
                                { "name": "min", "args": { "limit": 0 } },
                                { "name": "max", "args": { "limit": 50 } }
                            ]
                        }
                    }
                }
            ]
        }
    }
}
```

### 3.3.4. Schema for full entity without includes

```ts
const productSchema = getEntitySchema(productMetadata, {
    ignoreIncludes: true,
});
```

Generated schema:

```json
{
    "type": "object",
    "keys": {
        "id": {
            "type": "number",
            "flags": { "presence": "optional", "default": null },
            "rules": [{ "name": "integer" }, { "name": "sign", "args": { "sign": "positive" } }],
            "allow": [null]
        },
        "name": {
            "type": "string",
            "flags": { "presence": "required" },
            "rules": [
                { "name": "trim", "args": { "enabled": true } },
                { "name": "min", "args": { "limit": 0 } },
                { "name": "max", "args": { "limit": 50 } }
            ]
        },
        "price": {
            "type": "number",
            "flags": { "presence": "required" },
            "rules": [
                { "name": "sign", "args": { "sign": "positive" } },
                { "name": "precision", "args": { "limit": 2 } }
            ]
        },
        "title": {
            "type": "string",
            "flags": { "presence": "required" },
            "rules": [
                { "name": "trim", "args": { "enabled": true } },
                { "name": "min", "args": { "limit": 10 } },
                { "name": "max", "args": { "limit": 100 } }
            ]
        },
        "description": {
            "type": "string",
            "flags": { "presence": "required" },
            "rules": [
                { "name": "trim", "args": { "enabled": true } },
                { "name": "min", "args": { "limit": 50 } },
                { "name": "max", "args": { "limit": 200 } }
            ]
        },
        "category": {
            "type": "alternatives",
            "flags": { "presence": "required" },
            "matches": [
                {
                    "schema": {
                        "type": "object",
                        "keys": {
                            "id": {
                                "type": "number",
                                "flags": { "presence": "required" },
                                "rules": [
                                    { "name": "integer" },
                                    {
                                        "name": "sign",
                                        "args": { "sign": "positive" }
                                    }
                                ]
                            }
                        }
                    }
                },
                {
                    "schema": {
                        "type": "number",
                        "flags": { "presence": "required" },
                        "rules": [{ "name": "integer" }, { "name": "sign", "args": { "sign": "positive" } }]
                    }
                }
            ]
        },
        "tags": {
            "type": "array",
            "flags": { "default": [] },
            "items": [
                {
                    "type": "alternatives",
                    "flags": { "presence": "required" },
                    "matches": [
                        {
                            "schema": {
                                "type": "object",
                                "keys": {
                                    "id": {
                                        "type": "number",
                                        "flags": { "presence": "required" },
                                        "rules": [
                                            { "name": "integer" },
                                            {
                                                "name": "sign",
                                                "args": { "sign": "positive" }
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            "schema": {
                                "type": "number",
                                "flags": { "presence": "required" },
                                "rules": [
                                    { "name": "integer" },
                                    {
                                        "name": "sign",
                                        "args": { "sign": "positive" }
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    }
}
```

### 3.3.5. Validation

```ts
product = await productSchema.validateAsync(product, {
    stripUnknown: true,
    convert: true,
    abortEarly: false,
});
```