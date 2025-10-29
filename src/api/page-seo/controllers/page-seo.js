'use strict';

/**
 * page-seo controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::page-seo.page-seo', ({ strapi }) => ({
  /**
   * 根据页面路径和语言获取SEO配置
   * GET /api/page-seos/by-path?path=/products&locale=zh-CN
   */
  async findByPath(ctx) {
    const { path, locale = 'zh-CN' } = ctx.query;

    if (!path) {
      return ctx.badRequest('页面路径参数(path)是必需的');
    }

    try {
      const entries = await strapi.entityService.findMany('api::page-seo.page-seo', {
        filters: {
          pagePath: path,
          locale: locale,
        },
        populate: {
          ogImage: true,
          twitterImage: true,
        },
        publicationState: 'live',
        locale: locale,
      });

      if (!entries || entries.length === 0) {
        return ctx.notFound('未找到该页面的SEO配置');
      }

      // 返回第一个匹配的结果
      return entries[0];
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  /**
   * 根据页面名称和语言获取SEO配置
   * GET /api/page-seos/by-name?name=home&locale=zh-CN
   */
  async findByName(ctx) {
    const { name, locale = 'zh-CN' } = ctx.query;

    if (!name) {
      return ctx.badRequest('页面名称参数(name)是必需的');
    }

    try {
      const entries = await strapi.entityService.findMany('api::page-seo.page-seo', {
        filters: {
          pageName: name,
          locale: locale,
        },
        populate: {
          ogImage: true,
          twitterImage: true,
        },
        publicationState: 'live',
        locale: locale,
      });

      if (!entries || entries.length === 0) {
        return ctx.notFound('未找到该页面的SEO配置');
      }

      // 返回第一个匹配的结果
      return entries[0];
    } catch (err) {
      ctx.throw(500, err);
    }
  },
}));



