import TodoManager from './components/TodoManager';

export const keyword = 'todos';
export const name = 'Manage Org Todos...';

export const fn = async ({ term, display, settings }) => {

  if (!term.startsWith(keyword)) return;

  display({
    title: `for ${settings.todoFile}`,
    getPreview: () => <TodoManager todoFile={settings.todoFile} />
  });

};

export const settings = {
  todoFile: {
    type: 'string',
    description: 'path to org file containing todos'
  }
};
