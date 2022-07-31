module.exports = {
  prompt: ({ prompter, args }) =>
    prompter
      .prompt({
        type: 'input',
        name: 'name',
        message: '파일 이름을 입력하세요.',
      })
      .then(({ name }) => {
        if (!name) {
          throw new Error('파일 이름을 입력하세요!');
        }

        return prompter
          .prompt({
            type: 'input',
            name: 'title',
            message: '포스트의 제목을 입력하세요',
          })
          .then(({ title }) => {
            if (!title) {
              throw new Error('포스트의 제목을 입력하세요!');
            }

            return prompter
              .prompt({
                type: 'input',
                name: 'description',
                message: '(선택) 포스트의 설명을 입력하세요',
              })
              .then(({ description }) => {
                // 최종적으로 반환하는 객체의 형태입니다.
                return prompter
                  .select({
                    type: 'input',
                    name: 'tag',
                    message: '포스트의 태그를 선택하세요',
                    choices: ['React', 'Typescript'],
                  })
                  .then((choice) => {
                    // 최종적으로 반환하는 객체의 형태입니다.
                    return {
                      title: title,
                      description: description,
                      tag: choice,
                      name: name,
                      args,
                    };
                  });
              });
          });
      }),
};
