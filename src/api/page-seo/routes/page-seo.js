'use strict';

/**
 * page-seo router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::page-seo.page-seo');

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const myExtraRoutes = [
  {
    method: 'GET',
    path: '/page-seos/by-path',
    handler: 'page-seo.findByPath',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/page-seos/by-name',
    handler: 'page-seo.findByName',
    config: {
      auth: false,
    },
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);



