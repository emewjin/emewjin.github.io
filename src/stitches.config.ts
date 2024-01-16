import { createStitches } from '@stitches/react';

const primaryColors = {
  primary100: '#c8dbe9',
  primary200: '#a4c3db',
  primary300: '#7fabcc',
  primary400: '#5b93be',
  primary500: '#4179a4',
};

export const { styled, css, getCssText, createTheme, globalCss } =
  createStitches({
    prefix: '',
    theme: {
      colors: {
        gray100: '#f6f6f6',
        gray200: '#ddd',
        gray300: '#a0aec0',
        gray400: '#68768a',
        gray500: '#495467',
        gray600: '#2d3748',
        gray700: '#1a202c',
        white: '#fff',
        black: '#000',
        yellow: '#ffd75e',
        yellowAccent: '#ffa659',

        ...primaryColors,

        text100: '$gray300',
        text200: '$gray400',
        text300: '$gray500',
        text400: '$gray600',
        text500: '$gray700',

        backgroundColor: '$white',

        borderGray: '$gray200',
        borderPrimary: '$primary200',

        inlineCodeBackground: '#f8f8f8',
        inlineCodeColor: '$primary500',
        inlineCodeBorderColor: '#f1f3f5',
        link: '$primary400',

        titleFilterBackground: '$gray100',
        tagColor: '$primary400',
        tagFilterBackground: '$gray100',

        headerCircleColor: '$primary200',

        themeSwitchBackground: '$gray500',
      },
      sizes: {
        contentWidth: '43.75rem',
      },
      shadows: {
        themeSymbol: '$colors$gray400',
      },
      transitions: {
        transitionDuration: '0.2s',
        transitionTiming: 'ease-in',
        switchTransitionDuration: '0.1s',
      },
    },
    media: {
      desktop: '(min-width: 1240px)',
      md: '(min-width: 48em)',
    },
  });

export const darkTheme = createTheme('dark-theme', {
  colors: {
    gray100: '#303136',
    gray200: '#3d4144',
    gray300: '#d6cfc4',
    gray400: '#b8ae9f',
    gray500: '#cfc8bc',
    gray600: '#e5dfd6',
    gray700: '#f6f1ea',
    black: '#222425',

    ...primaryColors,

    text100: '$gray300',
    text200: '$gray400',
    text300: '$gray500',
    text400: '$gray600',
    text500: '$gray700',

    backgroundColor: '$black',

    borderGray: '$gray200',
    borderPrimary: '$primary200',

    inlineCodeBackground: '#3d4144',
    inlineCodeColor: '$primary100',
    inlineCodeBorderColor: '#3d4144',

    link: '$primary200',

    titleFilterBackground: '$gray200',
    tagColor: '$primary400',
    tagFilterBackground: '$primary100',

    headerCircleColor: '$gray200',
  },
});
