import { styled } from '~/stitches.config';

export const Header = styled('header', {
  margin: '1rem auto',
});

export const Title = styled('h2', {
  fontSize: '1.5rem',

  a: {
    color: '$text500',

    transition: 'color $transitionDuration $transitionTiming',
  },
});

export const Section = styled('section', {
  color: '$text200',

  transition: 'color $transitionDuration $transitionTiming',
});

export const Footer = styled('footer', {
  color: '$text200',
  fontSize: '0.9rem',

  marginBottom: '3rem',

  cursor: 'pointer',
});
