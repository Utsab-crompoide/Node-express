import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0', // Use OpenAPI 3.0.0 for compatibility
    info: {
      title: 'Node Test',
      version: '1.0.0',
      description: 'API documentation for Node.js application',
    },
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
