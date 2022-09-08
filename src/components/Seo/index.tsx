import React from 'react';
import { Helmet } from 'react-helmet';

import { useSeo } from '~/hooks/useSeo';

interface Props {
  description: string;
  lang: string;
  title: string;
  meta?: Metadata[];
  noSiteName?: boolean;
}

const Seo = ({
  description,
  lang,
  meta = [],
  title,
  noSiteName = false,
}: Props) => {
  const { site } = useSeo();

  if (site === undefined) {
    return null;
  }

  const metaDescription = description || site.siteMetadata?.description;
  const defaultTitle = site.siteMetadata?.title;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={noSiteName ? undefined : `%s | ${defaultTitle}`}
      meta={[
        {
          name: 'author',
          content: 'emewjin',
        },
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:creator',
          content: site.siteMetadata?.social?.twitter || '',
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: metaDescription,
        },
        {
          name: 'google-site-verification',
          content: 'A0laYsg8I6K8AsAfHC3tcbE96HfVzrxnCYcPyII67RY',
        },
        {
          name: 'naver-site-verification',
          content: '4a519a1eb6f97e3b51daa81a5509a649a73b03d4',
        },
      ].concat(meta)}
    />
  );
};

export default Seo;
