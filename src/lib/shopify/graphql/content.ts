// ============================================================
//  Content GraphQL operations — menus, shop, blog (2026-04)
// ============================================================
import { IMAGE_FRAGMENT } from './fragments';

const ARTICLE_CARD = /* GraphQL */ `
  fragment ArticleCard on Article {
    id
    handle
    title
    excerpt
    publishedAt
    image { ...ImageFields }
    authorV2 { name }
  }
`;

/** A blog's articles (newest first), paginated. */
export const ARTICLES_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${ARTICLE_CARD}
  query Articles($blog: String!, $first: Int, $after: String) {
    blog(handle: $blog) {
      handle
      title
      articles(first: $first, after: $after, sortKey: PUBLISHED_AT, reverse: true) {
        pageInfo { hasNextPage endCursor }
        edges { node { ...ArticleCard } }
      }
    }
  }
`;

/** A single article by handle within a blog. */
export const ARTICLE_BY_HANDLE_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  query Article($blog: String!, $handle: String!) {
    blog(handle: $blog) {
      handle
      articleByHandle(handle: $handle) {
        id
        handle
        title
        contentHtml
        excerpt
        publishedAt
        image { ...ImageFields }
        authorV2 { name }
        seo { title description }
      }
    }
  }
`;


/** Navigation menu by handle (e.g. "main-menu", "footer"); nests 3 levels. */
export const MENU_QUERY = /* GraphQL */ `
  query Menu($handle: String!) {
    menu(handle: $handle) {
      id
      title
      items {
        id
        title
        url
        type
        items {
          id
          title
          url
          type
          items {
            id
            title
            url
            type
          }
        }
      }
    }
  }
`;

/** Shop name + primary domain — for SEO and footer. */
export const SHOP_QUERY = /* GraphQL */ `
  query Shop {
    shop {
      name
      description
      primaryDomain {
        url
        host
      }
    }
  }
`;

/** A CMS page by handle (about, shipping, etc.). */
export const PAGE_QUERY = /* GraphQL */ `
  query Page($handle: String!) {
    page(handle: $handle) {
      id
      title
      handle
      body
      bodySummary
      seo {
        title
        description
      }
    }
  }
`;
