import { styled, globalCss } from '~/stitches.config';

export const globalStyles = globalCss({
  ':root': {
    fontFamily:
      '"Pretendard", apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    textRendering: 'optimizeLegibility',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  },
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },
  html: {
    minHeight: '100vh',
  },
  body: {
    minHeight: '100vh',

    backgroundColor: '$backgroundColor',
  },
  '#___gatsby, #gatsby-focus-wrapper': {
    minHeight: '100vh',
  },
  a: {
    color: 'inherit',

    textDecoration: 'none',
  },
  h1: {
    fontSize: '1.75rem',
    fontWeight: 800,
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: 800,
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: 800,
    margin: '1.5rem 0 0.5rem 0',
  },
  h4: {
    fontSize: '1rem',
    fontWeight: 800,
    margin: '1.5rem 0 1rem 0',
  },
  h5: {
    fontWeight: 800,
    fontSize: '0.875rem',
  },
  h6: {
    fontWeight: 800,
    fontSize: '0.75rem',
  },
  strong: {
    fontWeight: 700,
  },
  hr: {
    marginTop: '0.25rem',
    marginBottom: '0.25rem',
    border: 0,
    borderTop: '0.125rem solid $borderGray',
  },
  img: {
    display: 'block',
    margin: '0 auto',
    maxWidth: '100%',
  },
  table: {
    width: '100%',
    marginTop: '0.75rem',
    marginBottom: '0.75rem',
    borderCollapse: 'collapse',

    lineHeight: '1.75rem',
  },
  tr: {
    borderBottom: '1px solid $borderGray',
  },
  th: {
    padding: '0.75rem',
  },
  td: {
    padding: '0.75rem',
  },
  p: {
    marginTop: '0.75rem',
    marginBottom: '0.75rem',

    lineHeight: 1.8,

    '> code[class*="language-"]': {
      whiteSpace: 'pre-wrap',
    },
  },
  blockquote: {
    paddingLeft: '1rem',
    borderLeft: '0.25rem solid $borderPrimary',
    color: '$text200',
  },
  article: {
    overflowWrap: 'break-word',
    'ul, ol': {
      lineHeight: 1.8,
      marginLeft: '2rem',

      'ul, ol': {
        marginLeft: '1.5rem',
      },

      li: {
        lineHeight: 1.8,

        p: {
          margin: 0,
        },
      },
    },

    ul: {
      li: {
        margin: '0.375rem 0',
      },
    },

    ol: {
      li: {
        margin: '1rem 0',
      },
    },

    'pre[class^="language-"]': {
      borderRadius: '0.25rem',
    },
  },
  ':not(pre) > code[class*="language-"]': {
    color: '$inlineCodeColor',
    background: '$inlineCodeBackground',
    border: 'solid 1px $inlineCodeBorderColor',
    borderRadius: '2px',
    fontSize: '0.9rem',
  },
});
export const Root = styled('div', {
  display: 'flex',
  minHeight: '100vh',

  color: '$text500',

  backgroundColor: '$backgroundColor',

  transition:
    'color $transitionDuration $transitionTiming, background-color $transitionDuration $transitionTiming',
});

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '$contentWidth',
  margin: '0 auto',
  paddingRight: '1em',
  paddingLeft: '1em',

  '@md': {
    padding: 0,
  },
});
