import React from 'react';
import { KeyboardNav, KeyboardNavItem } from 'cerebro-ui';
import { Text, Wrapper } from 'cerebro-ui/Form';

export default class TodoNode extends React.Component {

    constructor(props) {
        super(props);

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
                    break;
                case 'body':
                    this.state.updatedNode.body = update[k];
                    break;
                case 'todo': {
                    this.state.updatedNode.todo = update[k];
                    break;
                }
                default:
                    console.log(`unrecognized node field: ${k}`);
            }
        });

        this.setState({updatedNode: this.cloneNode(this.state.updatedNode)});
    }

    onNodeUpdateCancel() {
        this.setState({
            updatedNode: this.cloneNode(this.originalNode),
            editing: false
        });
    }

    onNodeSave() {
        this.props.onNodeSave(this.state.updatedNode);
        this.props.back();
    }

    onNodeDelete() {
        this.props.onNodeDelete();
        this.props.back();
    }

    render() {
        const { updatedNode, editing } = this.state;

        const headline = this.state.editing ?
                         <Text
                             type='text'
                             label='Headline'
                             value={updatedNode.headline}
                             onChange={(headline) => this.onNodeUpdate.bind(this)({headline})}
                         /> :
                         <h2>{updatedNode.headline}</h2>;

        const body = this.state.editing ?
                     <Wrapper label="Body">
                         <textarea onChange={(e) => this.onNodeUpdate.bind(this)({body: e.target.value})}>
                             {updatedNode.body}
                         </textarea>
                     </Wrapper> :
                     <p>{updatedNode.body}</p>;

        const readOptions = [
            <KeyboardNavItem onSelect={() => this.onNodeUpdate.bind(this)({todo: 'DONE'})}>
                mark as done
            </KeyboardNavItem>,
            <KeyboardNavItem onSelect={() => this.setState({editing: true})}>
                edit
            </KeyboardNavItem>,
            <KeyboardNavItem onSelect={this.onNodeDelete.bind(this)}>
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

        const options = editing ? editingOptions : readOptions;
        options.push(<KeyboardNavItem onSelect={() => this.props.back()}>back</KeyboardNavItem>);

        return (
            <div>
                <h5>{updatedNode.todo}</h5>
                <div>{headline}</div>
                <div>{body}</div>
                <KeyboardNav>
                    {options}
                </KeyboardNav>
            </div>
        );
    }
}
