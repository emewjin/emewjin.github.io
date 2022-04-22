import { styled } from '~/stitches.config';

export const TagList = styled('ul', {
  margin: 0,
  '& > li:first-child:before': {
    content: 'none',
  },
  '@md': {
    '& > li:first-child:before': {
      content: '•',
    },
  },
});

export const Tag = styled('li', {
  display: 'inline-block',
  '&:before': {
    margin: '0 0.25rem',

    content: '•',
  },
  listStyle: 'none',
});
