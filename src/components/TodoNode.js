import React from 'react';
import { KeyboardNav, KeyboardNavItem } from 'cerebro-ui';
import { Text } from 'cerebro-ui/Form';

export default class TodoNode extends React.Component {

    constructor(props) {
        super(props);

        console.log(this.props.index);
        console.log(this.props.node);

        this.originalNode = this.cloneNode(this.props.node);
        const updatedNode = this.cloneNode(this.props.node);

        console.log(this.originalNode);
        console.log(updatedNode);

        this.state = {
            editing: false,
            updatedNode
        };
    }

    cloneNode(node) {
        const nodeClass = Object.getPrototypeOf(node);
        const newNode = Object.create(nodeClass);
        const nodeClone = Object.assign(newNode, node);
        return nodeClone;
    }

    onNodeUpdate(update) {
        Object.keys(update).forEach(k => {
            switch(k) {
                case 'headline':
                    this.state.updatedNode.headline = update[k];
                    this.setState({updatedNode: this.cloneNode(this.state.updatedNode)});
                    break;
                case 'body':
                    this.state.updatedNode.body = update[k];
                    this.setState({updatedNode: this.cloneNode(this.state.updatedNode)});
                    break;
                default:
                    console.log(`unrecognized node field: ${k}`);
            }
        });
    }

    onNodeUpdateCancel() {
        this.setState({
            updatedNode: this.cloneNode(this.originalNode),
            editing: false
        });
    }

    async onNodeSave() {
        this.props.onNodeSave(this.props.index, this.state.updatedNode).then(() => {
            this.originalNode = this.cloneNode(this.state.updatedNode);
            this.setState({editing: false});
        });
    }

    render() {
        const headline = this.state.editing ?
                         <input type="text"
                                value={this.state.updatedNode.headline}
                                onChange={(e) => this.onNodeUpdate.bind(this)({headline: e.target.value})}/> :
                         <h2>{this.state.updatedNode.headline}</h2>;

        const body = this.state.editing ?
                     <textarea onChange={(e) => this.onNodeUpdate.bind(this)({body: e.target.value})}>
                         {this.state.updatedNode.body}
                     </textarea> :
                     <p>{this.state.updatedNode.body}</p>;

        const readOptions = [
            <KeyboardNavItem>
                mark as done
            </KeyboardNavItem>,
            <KeyboardNavItem onSelect={() => this.setState({editing: true})}>
                edit
            </KeyboardNavItem>,
            <KeyboardNavItem>
                delete
            </KeyboardNavItem>
        ];

        const editingOptions = [
            <KeyboardNavItem onSelect={this.onNodeSave.bind(this)}>
                save
            </KeyboardNavItem>,
            <KeyboardNavItem onSelect={this.onNodeUpdateCancel.bind(this)}>
                cancel
            </KeyboardNavItem>
        ];

        const options = this.state.editing ? editingOptions : readOptions;

        return (
            <div>
                {headline}
                {body}
                <KeyboardNav>
                    <ul>
                        {options}
                    </ul>
                </KeyboardNav>
            </div>
        );
    }
}
