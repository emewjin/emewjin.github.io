import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import React, { memo, PropsWithChildren } from 'react';

import { useAuthorProfile } from '~/hooks/useAuthorProfile';

import {
  Container,
  ExternalLinks,
  LinkItem,
  Name,
  Description,
  Wrapper,
  Job,
  Header
} from './styles';

interface SocialLinkProps {
  username?: string;
  urlPrefix: string;
}

const ExternalLink = ({
  username,
  urlPrefix,
  children,
}: PropsWithChildren<SocialLinkProps>) => {
  if (!username) {
    return null;
  }

  return (
    <LinkItem>
      <a href={`${urlPrefix}${username}`}>{children}</a>
    </LinkItem>
  );
};

interface SocialLink {
  text: string;
  url: string;
}

const Profile = () => {
  const siteMetadata = useAuthorProfile().site?.siteMetadata;

  const author = siteMetadata?.author;
  const description = siteMetadata?.description;
  const social = siteMetadata?.social;

  const socialLinks: Record<keyof GatsbyTypes.Social, SocialLink> = {
    github: {
      text: 'GitHub',
      url: 'https://github.com/',
    },
    twitter: {
      text: 'Twitter',
      url: 'https://twitter.com/',
    },
    facebook: {
      text: 'Facebook',
      url: 'https://www.facebook.com/',
    },
    instagram: {
      text: 'Instagram',
      url: 'https://www.instagram.com/',
    },
    linkedin: {
      text: 'LinkedIn',
      url: 'https://www.linkedin.com/in/',
    },
  };

  return (
    <Container>
      <StaticImage
        className='profile-image'
        layout='fixed'
        formats={['auto', 'webp', 'avif']}
        src='https://avatars.githubusercontent.com/u/76927618?v=4'
        width={70}
        height={70}
        quality={95}
        alt='Profile picture'
      />
      <Wrapper>
        <Header>
          <div>
            <Name>
              <Link to={'/'}>
                <strong>{author}</strong>
              </Link>
            </Name>
            <Job>Frontend Developer</Job>
          </div>
          <ExternalLinks>
            {Object.entries(social ?? {}).map(([key, username]) => {
              const serviceName = key as keyof GatsbyTypes.Social;

              return (
                <ExternalLink
                  key={serviceName}
                  username={username}
                  urlPrefix={socialLinks[serviceName].url}
                >
                  {serviceName === 'github' ? <i className='fa-brands fa-github'/> : socialLinks[serviceName].text}
                </ExternalLink>
              );
            })}
          </ExternalLinks>
        </Header>
        <Description>{description}</Description>
      </Wrapper>
    </Container>
  );
};

export default memo(Profile);
