const exampleProduct = {
    _id: "5e8f8f8f8f8f8f8f8f8f8f8f",
    cataLogId: "5e3e3e3e3e3e3e3e3e3e3e3e",
    name: "product",
    price: 100000,
    active: true,
    description: "product",
    image: [],
    unit: "pcs",
    weightPerUnit: 1000,
};

const exampleCatalog = {
    _id: "5e3e3e3e3e3e3e3e3e3e3e3e",
    name: "catalog",
    description: "catalog",
    products: [exampleProduct],
};

const productSchema = {
    type: 'object',
    properties: {
        cataLogId: { type: 'string', format: 'objectId' },
        _id: { type: 'string', format: 'objectid' },
        name: { type: 'string', required: true, minlength: 3, maxlength: 50 },
        price: { type: 'number', required: true },
        cost: { type: 'number', required: true },
        active: { type: 'boolean', required: true, default: true },
        description: { type: 'string', minlength: 3, maxlength: 500 },
        images: { type: [{ type: 'string' }], required: true, default: [] },
        unit: { type: 'string' },
        weightPerUnit: { type: 'number', min: 0, max: 1000000000 },
    }
};

const productSchemaNoId = {
    type: 'object',
    properties: {
        ...productSchema.properties,
        cataLogId: undefined,
        _id: undefined,
    }
};

const catalogSchema = {
    type: 'object',
    properties: {
        _id: { type: 'string', format: 'objectid' },
        name: { type: 'string', required: true, minlength: 3, maxlength: 50 },
        description: { type: 'string', minlength: 3, maxlength: 500 },
        products: { type: 'Array', items: productSchema },
    }
};

const catalogSchemaNoIdNoProduct = {
    type: 'object',
    properties: {
        ...catalogSchema.properties,
        _id: undefined,
        products: undefined,
    }
};

const getResponseSchema = (data) => {
    return {
        type: 'object',
        properties: {
            success: { type: 'boolean' },
            errors: { type: 'Any'},
            data: data,
        }
    }
};

const getResponse = (success, errors, data) => {
    return {
        success,
        errors,
        data,
    };
}

const server = [];
if (process.env.DEV_ENDPOINT) server.push({ url: process.env.DEV_ENDPOINT, description: 'development' });
if (process.env.PROD_ENDPOINT) server.push({ url: process.env.PROD_ENDPOINT, description: 'production' });

const swaggerDocumentation = {
    openapi: "3.0.0",
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API Documentation',
    },
    servers: server,
    components: {
        schemas: {
            Product: productSchema,
            Catalog: catalogSchema,
        }
    },
    paths: {
        "/api/v1/catalog/{catalogId}": {
            get: {
                tags: ["catalog"],
                description: "get a catalog by its id",
                parameters: [
                    {
                        name: "catalogId",
                        in: "path",
                        description: "Catalog Id",
                        required: true,
                        type: "string",
                        format: "objectid"
                    }
                ],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: getResponseSchema(catalogSchema),
                                example: getResponse(true, null, exampleCatalog),
                            }
                        }
                    },
                    404: {
                        description: "Not found",
                    },
                    500: {
                        description: "Internal Server Error",
                    }
                }
            },
        },

        "/api/v1/catalog": {
            post: {
                tags: ["catalog"],
                description: "Create a new catalog",
                requestBody: {
                    description: "New product",
                    required: true,
                    content: {
                        "application/json": {
                            schema: catalogSchemaNoIdNoProduct
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: getResponseSchema({ _id: { type: 'string', format: 'objectid' } }),
                                example: getResponse(true, null, { _id: "5e8f8f8f8f8f8f8f8f8f8f8f" }),
                            }
                        }
                    },
                    500: {
                        description: "Internal Server Error",
                        content: {}
                    }
                }
            }
        },

        "/api/v1/product/{productId}": {
            get: {
                tags: ["product"],
                description: "get a product by its id",
                parameters: [
                    {
                        name: "productId",
                        in: "path",
                        description: "Product Id",
                        required: true,
                        type: "string",
                        format: "objectid"
                    }
                ],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: getResponseSchema(productSchema),
                                example: getResponse(true, null, exampleProduct),
                            }
                        }
                    },
                    400: {
                        description: "Bad Request",
                    },
                    404: {
                        description: "Not found",
                    },
                    500: {
                        description: "Internal Server Error",
                    }
                }
            }
        },

        "/api/v1/product/catalog/{catalogId}": {
            post: {
                tags: ["product"],
                description: "Add product to catalog",
                parameters: [
                    {
                        name: "catalogId",
                        in: "path",
                        description: "Catalog Id",
                        required: true,
                        type: "string",
                        format: "objectid"
                    }
                ],
                requestBody: {
                    description: "New product",
                    required: true,
                    content: {
                        "application/json": {
                            schema: productSchemaNoId
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: 'object',
                                    $ref: "#/components/schemas/Product"
                                },
                                example: [
                                    exampleProduct
                                ]
                            }
                        }
                    },
                    400: {
                        description: "Bad Request",
                    },
                    500: {
                        description: "Internal Server Error",
                    }
                }
            }
        },

        "/api/v1/product/{productId}/activate": {
            put: {
                tags: ["product"],
                description: "Change product active status",
                parameters: [
                    {
                        name: "productId",
                        in: "path",
                        description: "Product Id",
                        required: true,
                        type: "string",
                        format: "objectid"
                    }
                ],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: getResponseSchema({ _id: { type: 'string', format: 'objectid' } }),
                                example: getResponse(true, null, { _id: "5e8f8f8f8f8f8f8f8f8f8f8f" }),
                            }
                        }
                    },
                    400: {
                        description: "Bad Request",
                    },
                    404: {
                        description: "Not found",
                    },
                    500: {
                        description: "Internal Server Error",
                    },
                }
            },
        },

        "/api/v1/product/{productId}/inactivate": {
            put: {
                tags: ["product"],
                description: "Change product active status",
                parameters: [
                    {
                        name: "productId",
                        in: "path",
                        description: "Product Id",
                        required: true,
                        type: "string",
                        format: "objectid"
                    }
                ],
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: getResponseSchema({ _id: { type: 'string', format: 'objectid' } }),
                                example: getResponse(true, null, { _id: "5e8f8f8f8f8f8f8f8f8f8f8f" }),
                            }
                        }
                    },
                    400: {
                        description: "Bad Request",
                    },
                    404: {
                        description: "Not found",
                    },
                    500: {
                        description: "Internal Server Error",
                    },
                }
            },
        },
    }
}

module.exports = swaggerDocumentation;