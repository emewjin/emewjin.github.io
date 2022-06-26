import { styled } from '~/stitches.config';

export const Article = styled('article', {
  position: 'relative',

  '& .heading-anchor': {
    borderBottom: 0,

    svg: {
      fill: '$text500',
    },
  },
});

export const TableOfContents = styled('div', {
  marginBottom: '1.5rem',

  '> ul': {
    marginLeft: 0,
  },

  ul: {
    listStyle: 'none',

    li: {
      paddingTop: '0.125rem',
      paddingBottom: '0.125rem',

      color: '$text200',
      fontSize: '0.875rem',

      transition: 'color $transitionDuration $transitionTiming',

      a: {
        textDecoration: 'underline',
      },
    },
  },
});

export const Header = styled('header', {
  marginBottom: '2rem',
});

export const Title = styled('h1', {
  fontSize: '1.8rem',
  lineHeight: '1.4',
});

export const ArticleMetadata = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginTop: '0.8rem',

  color: '$text200',

  fontWeight: 700,

  transition: 'color $transitionDuration $transitionTiming',

  'span:first-of-type::after': {
    margin: '0px 0.25rem',
    content: '|',
  },
  '@md': {
    marginTop: '0.5rem',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export const ArticleDates = styled('div', {
  display: 'flex',
});

export const Content = styled('section', {
  wordBreak: 'break-all',
  fontWeight: 500,
  h1: {
    marginTop: '2rem',
    marginBottom: '1.25rem',
    paddingBottom: '0.25rem',
    borderBottom: '1px solid $borderGray',

    a: {
      borderBottom: 'none',
    },
  },
  h2: {
    width: 'fit-content',
    marginTop: '3rem',
    marginBottom: '1rem',
    paddingBottom: '0.25rem',
    borderBottom: '2px solid $borderGray',

    a: {
      borderBottom: 'none',
      left: 'unset !important',
      right: '0 !important',
      width: 'fit-content',
      transform: 'translateX(105%) !important',
    },
  },
  'h3, h4': {
    width: 'fit-content',
    a: {
      borderBottom: 'none',
      left: 'unset !important',
      right: '0 !important',
      width: 'fit-content',
      transform: 'translateX(105%) !important',
    },
  },
  a: {
    borderBottom: '1px solid $borderPrimary',

    color: '$link',

    transition:
      'color $transitionDuration $transitionTiming, border-bottom-color $transitionDuration $transitionTiming',
  },
  pre: {
    code: {
      wordBreak: 'break-all',
      overflowWrap: 'break-word',
    },
  },
  'pre, code': {
    fontVariantLigatures: 'none',
  },
  li: {
    'p:first-of-type strong:first-of-type': {
      color: '$primary300',
    },
  },
  blockquote: {
    margin: '1.5rem 0',
  },
});

export const Footer = styled('footer', {
  '&:before': {
    display: 'block',
    width: '100%',
    height: '0.2rem',
    margin: '3rem auto',

    backgroundColor: '$primary200',

    transition: 'background-color $transitionDuration $transitionTiming',

    content: '',
  },
});
