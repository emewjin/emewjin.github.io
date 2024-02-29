import React, {
  ChangeEventHandler,
  memo,
  MouseEvent,
  useCallback,
} from 'react';

import { TAG } from '~/constants';

import { Container, Title, TagListWrapper, Tag, Input, Header } from './styles';

const FIXED_TAGS = ['번역'];

function reorderTags(tags: string[]): string[] {
  const fixedTags = tags.filter((tag) => FIXED_TAGS.includes(tag));
  const otherTags = tags.filter((tag) => !FIXED_TAGS.includes(tag));

  return fixedTags.concat(otherTags);
}

interface Props {
  tags: string[];
  titleFilter: string;
  onTitleFilterChange: ChangeEventHandler<HTMLInputElement>;
  currentTag: string;
  setCurrentTag: (tag: string) => void;
}

const ArticleFilter = ({
  tags,
  currentTag,
  setCurrentTag,
  titleFilter,
  onTitleFilterChange,
}: Props) => {
  const onClickTag = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const tag = (e.target as HTMLButtonElement).dataset['tag'] as string;

      setCurrentTag(tag);
    },
    [setCurrentTag]
  );

  return (
    <Container>
      <Header>
        <Title>Filter</Title>
        <Input
          type='text'
          placeholder='Article name..'
          value={titleFilter}
          onChange={onTitleFilterChange}
        />
      </Header>
      <TagListWrapper>
        <Tag
          type='button'
          data-tag={TAG.ALL}
          onClick={onClickTag}
          filtered={currentTag === TAG.ALL}
        >
          {TAG.ALL}
        </Tag>
        {reorderTags(tags).map((tag) => (
          <Tag
            type='button'
            key={tag}
            data-tag={tag}
            onClick={onClickTag}
            filtered={currentTag === tag}
          >
            {tag}
          </Tag>
        ))}
      </TagListWrapper>
    </Container>
  );
};

export default memo(ArticleFilter);
