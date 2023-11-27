import { DiscussionEmbed } from 'disqus-react';
import { PageProps, graphql } from 'gatsby';
import React from 'react';

import ArticleNavigator from '~/components/ArticleNavigator';
import Profile from '~/components/Profile';
import Seo from '~/components/Seo';
import Tags from '~/components/Tags';
import Utterances from '~/components/Utterances';
import { useComment } from '~/hooks/useComment';
import Layout from '~/layout';

import 'katex/dist/katex.min.css';

import {
  Article,
  TableOfContents,
  Content,
  Footer,
  Header,
  ArticleMetadata,
  Title,
  ArticleDates,
  ContentContainer,
} from './styles';

const BlogPostTemplate = ({
  data,
  location,
}: PageProps<GatsbyTypes.BlogPostBySlugQuery>) => {
  const post = data.markdownRemark!;
  const siteUrl = data.site?.siteMetadata?.siteUrl ?? '';
  const siteTitle = data.site?.siteMetadata?.title ?? '';
  const { previous, next } = data;
  const { title, description, date, lastUpdated, tags } = post.frontmatter!;
  const ogImage = post.fields?.slug
    ? `${siteUrl}/og-image${post.fields.slug}index.png`
    : '';

  const commentConfig = useComment().site?.siteMetadata?.comment;

  const disqusConfig = {
    title,
    identifier: post.fields?.slug,
  };
  const meta: Metadata[] = [];

  if (!!ogImage) {
    const properties = ['og:image', 'twitter:image'];

    for (const property of properties) {
      meta.push({
        property,
        content: ogImage,
      });
    }
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        lang='en'
        title={title ?? ''}
        description={description ?? post.excerpt ?? ''}
        meta={meta}
      />

      <Article itemScope itemType='http://schema.org/Article'>
        <Header>
          <Title itemProp='headline'>{title}</Title>
          <ArticleMetadata>
            <ArticleDates>
              <span title='최초 작성일'>{date}</span>
              <span title='최신 수정일'>{lastUpdated}</span>
            </ArticleDates>
            <Tags tags={tags as string[]} />
          </ArticleMetadata>
        </Header>
        <ContentContainer>
          <Content
            dangerouslySetInnerHTML={{ __html: post.html ?? '' }}
            itemProp='articleBody'
          />
          <TableOfContents
            dangerouslySetInnerHTML={{ __html: post.tableOfContents ?? '' }}
          />
        </ContentContainer>
      </Article>

      <Footer>
        <Profile />
      </Footer>
      {commentConfig?.utterances && (
        <Utterances repo={commentConfig.utterances} />
      )}
      {commentConfig?.disqusShortName && (
        <DiscussionEmbed
          shortname={commentConfig?.disqusShortName}
          config={disqusConfig}
        />
      )}
      <ArticleNavigator previousArticle={previous} nextArticle={next} />
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      tableOfContents
      excerpt(pruneLength: 160)
      html
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        lastUpdated(formatString: "YYYY-MM-DD")
        description
        tags
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
