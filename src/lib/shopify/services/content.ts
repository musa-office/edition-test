// ============================================================
//  Content services — menus, shop, blog articles (2026-04)
// ============================================================
import { shopifyFetch } from '../client';
import {
  MENU_QUERY,
  SHOP_QUERY,
  PAGE_QUERY,
  ARTICLES_QUERY,
  ARTICLE_BY_HANDLE_QUERY,
} from '../graphql/content';
import type { Image, Menu, PageInfo, Paginated, Shop } from '../types';

export interface ShopifyPage {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary?: string;
  seo?: { title?: string | null; description?: string | null };
}

export interface Article {
  id: string;
  handle: string;
  title: string;
  excerpt?: string | null;
  contentHtml?: string;
  publishedAt: string;
  image?: Image | null;
  author?: string | null;
  seo?: { title?: string | null; description?: string | null };
}

function mapArticle(node: any): Article {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    excerpt: node.excerpt || null,
    contentHtml: node.contentHtml,
    publishedAt: node.publishedAt,
    image: node.image ?? null,
    author: node.authorV2?.name ?? null,
    seo: node.seo,
  };
}

/** A blog's articles (newest first). Empty list if the blog is missing. */
export async function getArticles(
  blog: string,
  params: { pageSize?: number; after?: string | null } = {},
): Promise<Paginated<Article>> {
  const data = await shopifyFetch<{ blog: any | null }>(ARTICLES_QUERY, {
    blog,
    first: params.pageSize ?? 12,
    after: params.after ?? null,
  });
  const conn = data.blog?.articles;
  const items: Article[] = (conn?.edges ?? []).map((e: any) => mapArticle(e.node));
  const pageInfo: PageInfo = {
    hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
    hasPreviousPage: false,
    endCursor: conn?.pageInfo?.endCursor ?? null,
    startCursor: null,
  };
  return { items, pageInfo };
}

/** A single article by handle within a blog, or null. */
export async function getArticle(blog: string, handle: string): Promise<Article | null> {
  const data = await shopifyFetch<{ blog: any | null }>(ARTICLE_BY_HANDLE_QUERY, { blog, handle });
  const node = data.blog?.articleByHandle;
  return node ? mapArticle(node) : null;
}

/** A CMS page by handle, or null if it doesn't exist. */
export async function getPage(handle: string): Promise<ShopifyPage | null> {
  const data = await shopifyFetch<{ page: ShopifyPage | null }>(PAGE_QUERY, { handle });
  return data.page ?? null;
}

/** Navigation menu by handle (e.g. "main-menu", "footer"). Null if missing. */
export async function getMenu(handle: string): Promise<Menu | null> {
  const data = await shopifyFetch<{ menu: Menu | null }>(MENU_QUERY, { handle });
  return data.menu ?? null;
}

/** Shop name + primary domain. */
export async function getShop(): Promise<Shop> {
  const data = await shopifyFetch<{ shop: Shop }>(SHOP_QUERY);
  return data.shop;
}
