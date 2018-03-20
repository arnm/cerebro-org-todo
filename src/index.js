const org = require('org-mode-parser');
const fs = require('fs');

import TodoNode from './components/TodoNode';

function makelist(orgFile) {
  return new Promise((res, rej) => {
    try {
      org.makelist(orgFile, (nodes) => {
        res(nodes);
      });
    } catch (e) {
      rej(e);
    }
  });
}

function read(filename) {
  return new Promise((res, rej) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) rej(err);
      res(data);
    });
  });
}

function write(filename, data) {
  return new Promise((res, rej) => {
    fs.writeFile(filename, data, 'utf8', (err) => {
      if (err) rej(err);
      res();
    });
  });
}

export const keyword = 'todos';
export const name = 'Manage Org Todos...';

export const fn = async ({ term, display, settings }) => {

  if (!term.startsWith(keyword)) return;

  const nodes = (await makelist(settings.todoFile));

  const onNodeSave = async (index, updatedNode) => {
    nodes[index] = updatedNode;

    const updatedContent = nodes.map(node => node.toOrgString().trim()).join('\n\n');
    await write(settings.todoFile, updatedContent);
  };

  nodes.forEach((node, index) => {
    if (node.todo === null) return;

    console.log(`looping: ${index}`);
    display({
      title: node.headline,
      // key for react rendering, index for node saving logic
      getPreview: () => <TodoNode node={node} key={index} index={index} onNodeSave={onNodeSave}/>
    });
  });

};

export const settings = {
  todoFile: {
    type: 'string',
    description: 'path to org file containing todos'
  }
};
