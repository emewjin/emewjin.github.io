import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';

import { createCanvas, registerFont } from 'canvas';
import type { CanvasRenderingContext2D } from 'canvas';
import type {
  CreateNodeArgs,
  CreatePagesArgs,
  CreateSchemaCustomizationArgs,
} from 'gatsby';
import { createFilePath } from 'gatsby-source-filesystem';

export const createPages = async ({
  graphql,
  actions,
  reporter,
}: CreatePagesArgs) => {
  const blogPost = path.resolve('./src/templates/blog-post.tsx');

  const result: {
    errors?: Error;
    data?: {
      allMarkdownRemark: {
        nodes: GatsbyTypes.MarkdownRemark[];
      };
    };
  } = await graphql(`
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___lastUpdated], order: ASC }
        limit: 1000
      ) {
        nodes {
          id
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(
      'There was an error loading your blog posts',
      result.errors
    );
    return;
  }

  const posts = result.data?.allMarkdownRemark.nodes;

  if (posts !== undefined && posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id;
      const nextPostId =
        index === posts.length - 1 ? null : posts[index + 1].id;

      post.fields?.slug &&
        post.frontmatter?.title &&
        generateOGImage(post.fields.slug, post.frontmatter.title);

      actions.createPage({
        path: post.fields?.slug || '',
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
          ogImage: `public/og-image${post.fields?.slug || '/'}index.png`,
        },
      });
    });
  }
};

export const onCreateNode = ({ node, actions, getNode }: CreateNodeArgs) => {
  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({ node, getNode });

    actions.createNodeField({
      name: 'slug',
      node,
      value,
    });
  }
};

export const createSchemaCustomization = ({
  actions,
}: CreateSchemaCustomizationArgs) => {
  actions.createTypes(`
    type SiteSiteMetadata {
      author: String
      description: String
      siteUrl: String
      social: Social
      thumbnail: String
    }

    type Social {
      github: String
      twitter: String
      facebook: String
      linkedin: String
      instagram: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      lastUpdated: Date @dateformat
      tags: [String]
      thumbnail: String
    }

    type Fields {
      slug: String
    }
  `);
};

const generateOGImage = (slug: string, postTitle: string) => {
  const height = 400;
  const width = 800;

  registerFont('src/fonts/Pretendard/woff/Pretendard-Black.woff', {
    family: 'Pretendard',
  });

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // 배경 색상
  context.fillStyle = '#fff';
  context.fillRect(0, 0, width, height);

  // 폰트 스타일
  const angle = (45 * Math.PI) / 180;
  const x2 = 300 * Math.cos(angle);
  const y2 = 300 * Math.sin(angle);
  const gradient = context.createLinearGradient(0, 0, x2, y2);
  gradient.addColorStop(0, '#b597f6');
  gradient.addColorStop(1, '#96c6ea');
  context.fillStyle = gradient;
  context.font = '50px Pretendard';
  context.textAlign = 'left';
  context.textBaseline = 'bottom';

  function wrapPostTitle(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const currentWidth = ctx.measureText(currentLine + ' ' + word).width;
      if (currentWidth < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  const wrappedPostTitleLines = wrapPostTitle(context, postTitle, width * 0.7);

  wrappedPostTitleLines.forEach((line, index) => {
    context.fillText(line, 20, height * 0.3 + index * 60);
  });

  const buffer = canvas.toBuffer('image/png');

  if (!existsSync(`public/og-image${slug.slice(0, -1)}`)) {
    mkdirSync(`public/og-image${slug.slice(0, -1)}`, { recursive: true });
  }

  writeFileSync(`public/og-image${slug}index.png`, buffer);
};
