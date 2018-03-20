import React from 'react';
import { KeyboardNav, KeyboardNavItem } from 'cerebro-ui'

const org = require('org-mode-parser');
const fs = require('fs');

import TodoNode from './TodoNode';

export default class TodoManager extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            nodes: [],
            currentNode: null,
            currentIndex: null
        };
    }

    componentDidMount() {
        console.log('did mount');
        this.makelist(this.props.todoFile).then(nodes => {
            this.setState({
                nodes
            });
        });
    }

    async makelist(orgFile) {
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

    async read(filename) {
        return new Promise((res, rej) => {
            fs.readFile(filename, 'utf8', (err, data) => {
                if (err) rej(err);
                res(data);
            });
        });
    }

    async write(filename, data) {
        return new Promise((res, rej) => {
            fs.writeFile(filename, data, 'utf8', (err) => {
                if (err) rej(err);
                res();
            });
        });
    }

    async onNodeSave(updatedNode) {
        this.state.nodes[this.state.currentIndex] = updatedNode;

        const updatedContent = this.state.nodes.map(node => node.toOrgString().trim()).join('\n\n');
        await this.write(this.props.todoFile, updatedContent);

        this.setState({nodes: this.state.nodes});
    };

    async onNodeDelete()  {
        this.state.nodes.splice(this.state.currentIndex, 1);

        const updatedContent = this.state.nodes.map(node => node.toOrgString().trim()).join('\n\n');
        await this.write(this.props.todoFile, updatedContent);

        this.setState({nodes: this.state.nodes, currentIndex: null});
    };

    back() {
        this.setState({currentNode: null, currentIndex: null});
    }

    render() {
        const nodeList = (
            <KeyboardNav>
                {this.state.nodes.filter(n => n.todo !== null).map((n, i) =>
                    <KeyboardNavItem
                        key={`${n.key}-${n.headline}`}
                        onSelect={() => this.setState({currentNode: n, currentIndex: i})}>
                        <h3>{`${n.todo} ${n.headline}`}</h3>
                    </KeyboardNavItem>
                )}
            </KeyboardNav>
        );

        const { currentNode } = this.state;

        return currentNode ? <TodoNode
                                 key={`${currentNode.key}-${currentNode.headline}`}
                                 node={currentNode}
                                 back={this.back.bind(this)}
                                 onNodeSave={this.onNodeSave.bind(this)}
                                 onNodeDelete={this.onNodeDelete.bind(this)}
        /> : nodeList;
    }
}
