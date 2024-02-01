import { Link } from 'gatsby';

import { styled } from '~/stitches.config';

export const Container = styled('nav', {
  margin: '1rem auto',
});

export const NavigationList = styled('ul', {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  margin: 0,

  listStyle: 'none',
  li: {
    width: 'fit-content',
  },
  'li:last-of-type': {
    alignSelf: 'end',
  },
});

export const PostLink = styled(Link, {
  display: 'block',
  padding: '0.5rem 0',
  borderRadius: '0.5rem',

  color: '$link',
  fontSize: '1rem',
});
