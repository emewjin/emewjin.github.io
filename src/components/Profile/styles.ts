import { styled } from '~/stitches.config';

export const Container = styled('div', {
  display: 'grid',
  gridTemplateColumns: '70px auto',
  marginBottom: '2rem',
  padding: '1rem',
  borderRadius: '1rem',

  backgroundColor: '$gray100',

  transition: 'background-color $transitionDuration $transitionTiming',

  '.profile-image': {
    borderRadius: '50%',

    transform: 'translateZ(0)',
  },
});

export const Wrapper = styled('div', {
  paddingRight: '1rem',
  paddingLeft: '1rem',

  color: '$text300',

  transition: 'color $transitionDuration $transitionTiming',
});

export const Header = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
});

export const Name = styled('p', {
  margin: 0,

  fontSize: '1.25rem',
});

export const Job = styled('p', {
  marginTop: 0,
  marginBottom: '0.5rem',

  fontWeight: 500,
});

export const Description = styled('p', {
  lineHeight: 1.3,
  wordBreak: 'keep-all',
  whiteSpace: 'pre-line',
});

export const ExternalLinks = styled('ul', {
  display: 'flex',
  gap: '1em',
  marginTop: '1em',
  marginLeft: 0,
});

export const LinkItem = styled('li', {
  display: 'inline-block',

  listStyle: 'none',

  transition: 'color $transitionDuration $transitionTiming',

  a: {
    color: '$link',
  },
});
