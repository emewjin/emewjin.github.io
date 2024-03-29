import { styled } from '~/stitches.config';

export const Container = styled('section', {
  margin: '2rem auto',
  padding: '1rem',
  borderLeft: '0.25rem solid $borderPrimary',

  transition: 'border-left-color $transitionDuration $transitionTiming',
});

export const Header = styled('div', {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
});

export const Title = styled('h3', {
  display: 'block',
  color: '$text300',
  margin: 0,
  transition: 'color $transitionDuration $transitionTiming',
  '&::after': {
    content: '" 정렬 : 최신 수정일 "',
    marginLeft: '5px',
    color: '$text200',
    fontSize: '0.9rem',
    fontWeight: 'normal',
  },
});

export const Input = styled('input', {
  maxWidth: '18.75rem',
  width: '100%',
  padding: '0.5rem 0.75rem',
  border: '1px solid $borderGray',
  borderRadius: '0.25rem',

  color: '$text500',
  fontSize: '1rem',

  backgroundColor: '$titleFilterBackground',

  transition:
    'color $transitionDuration $transitionTiming, border-color $transitionDuration $transitionTiming, background-color $transitionDuration $transitionTiming',

  appearance: 'none',
});

export const TagListWrapper = styled('div', {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '1rem',
  paddingBottom: '1rem',
  overflowX: 'scroll',
});

export const Tag = styled('button', {
  flexShrink: 0,
  padding: '0.5rem 1rem',
  border: 0,
  borderRadius: '0.25rem',

  color: '$tagColor',
  fontSize: '0.875rem',

  backgroundColor: '$tagFilterBackground',
  cursor: 'pointer',

  transition:
    'color $transitionDuration $transitionTiming, background-color $transitionDuration $transitionTiming',

  appearance: 'none',

  variants: {
    filtered: {
      true: {
        color: '$primary500',

        backgroundColor: '$primary100',
      },
    },
  },
});
