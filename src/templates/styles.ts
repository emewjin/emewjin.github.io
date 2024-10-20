import { styled } from '~/stitches.config';

export const ContentContainer = styled('div', {
  display: 'flex',
  position: 'relative',
  flexDirection: 'column-reverse',
  '@desktop': {
    flexDirection: 'row',
  },
});

export const Article = styled('article', {
  position: 'relative',

  '& .heading-anchor': {
    borderBottom: 0,

    svg: {
      fill: '$text500',
    },
  },

  '.twitter-tweet-rendered': {
    margin: '0 auto',
  },
});

export const TableOfContents = styled('div', {
  '@desktop': {
    scrollbarWidth: 'thin',
    scrollbarColor: '$gray200 transparent',
    '&::-webkit-scrollbar': {
      width: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '$gray200',
      borderRadius: '20px',
      border: '3px solid transparent',
      backgroundClip: 'content-box',
    },

    position: 'sticky',
    minWidth: 'fit-content',
    width: 210,
    top: 128,
    height: 'fit-content',
    maxHeight: 500,
    margin: '0 2rem 1.5rem 2rem',
    overflowY: 'scroll',
  },

  '> ul': {
    marginLeft: 0,
  },

  ul: {
    width: 'inherit',
    listStyle: 'none',

    li: {
      padding: '0.125rem 0',

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
  // marginBottom: '2rem',
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
  minWidth: '100%',
  wordBreak: 'break-all',
  fontWeight: 500,
  fontSize: '1.1rem',
  '.footnotes': {
    hr: {
      margin: '3rem 0',
    },
    ol: {
      marginRight: '1rem',
    },
    li: {
      wordBreak: 'break-word',
    },
    color: '$text200',
    fontSize: '0.9rem',
    code: {
      fontSize: '0.9rem',
    },
  },
  '@desktop': {
    fontSize: '1.15rem',
    fontWeight: 400,
    'h1, h2, h3, h4, h5, h6': {
      fontWeight: 700,
    },
  },
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
      float: 'left',
      textSizeAdjust: '100%',
      minWidth: '100%',
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
    fontStyle: 'italic',
  },
  figcaption: {
    textAlign: 'center',
    margin: '0.5rem 0 1rem 0',
    color: '$text200',
    fontSize: '0.875rem',
    p: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    'p:has(code)': {
      display: 'inline',
    },
    a: {
      width: 'fit-content',
      textDecoration: 'underline',
      textUnderlinePosition: 'under',
      border: 'none',
    },
  },
  '.gatsbyRemarkImagesGrid-grid': {
    img: {
      height: '100%',
    },
  },
  '.gatsby-highlight': {
    fontSize: '16px',
    code: {
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
  },
  '.gatsby-highlight-code-line': {
    backgroundColor: '#3d485a',
    display: 'block',
    marginRight: '-1em',
    paddingRight: '1em',
    marginLeft: '-1em',
    paddingLeft: '0.75em',
    borderLeft: '0.25em solid #aad5ff',
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
