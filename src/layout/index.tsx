import { Script, type PageProps } from 'gatsby';
import React, { ComponentProps } from 'react';

import Footer from '~/components/Footer';
import Header from '~/components/Header';

import { Container, globalStyles, Root } from './styles';

type Props = React.PropsWithChildren<Pick<PageProps, 'location'>> &
  ComponentProps<typeof Header>;

const Layout = ({ title, children, resetFilter }: Props) => {
  globalStyles();

  return (
    <Root>
      <Container>
        <Header title={title} resetFilter={resetFilter} />
        <main>{children}</main>
        <Footer />
      </Container>
      <Script
        src='https://giscus.app/client.js'
        data-repo='emewjin/comments'
        data-repo-id='R_kgDOGiptZg'
        data-category='Comments'
        data-category-id='DIC_kwDOGiptZs4CcqJV'
        data-mapping='pathname'
        data-strict='0'
        data-reactions-enabled='1'
        data-emit-metadata='1'
        data-input-position='top'
        data-theme='preferred_color_scheme'
        data-lang='ko'
        crossOrigin='anonymous'
        async
      />
    </Root>
  );
};

export default Layout;
