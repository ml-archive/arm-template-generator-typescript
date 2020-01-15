import { Component, ChangeEvent } from "react";
import React = require("react");
import Select from "../Inputs/Select";

interface VariableFormProps {
    initialValue?: string | object | object[];
    name?: string;
    onSubmit: (value: string | object | object[], name: string) => void;
}

class VariableFormState {
    name: string;
    type: string;
    value: string;
}

export class VariableForm extends Component<VariableFormProps, VariableFormState> {
    constructor(props: VariableFormProps) {
        super(props);

        this.setName = this.setName.bind(this);
        this.setType = this.setType.bind(this);
        this.setValue = this.setValue.bind(this);
        this.submitForm = this.submitForm.bind(this);

        this.state = this.initializeState(props);
    }

    initializeState(props: VariableFormProps): VariableFormState {
        let state = new VariableFormState();
        if(props.initialValue) {
            state.value = JSON.stringify(props.initialValue);

            switch(state.value[0]) {
                case "[":
                    state.type = "array";
                    break;
                case "{":
                    state.type = "object";
                    break;
                default:
                    state.type = "string";
                    break;
            }

            if(state.value[0] === "\"") {
                state.value = state.value.substr(1, state.value.length - 2);
            }
        } else {
            state.value = "";
            state.type = "string";
        }

        if(props.name) {
            state.name = props.name;
        } else {
            state.name = "";
        }

        return state;
    }

    componentDidUpdate(prevProps: VariableFormProps): void {
        if(this.props.name === prevProps.name) {
            return;
        }

        this.setState(this.initializeState(this.props));
    }

    setName(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({
            name: event.currentTarget.value
        });
    }

    setType(type: string): void {
        this.setState({
            type: type
        });
    }

    setValue(event: ChangeEvent<HTMLInputElement>): void {
        this.setState({
            value: event.currentTarget.value
        });
    }

    submitForm(): void {
        if(this.state.type === "string") {
            this.props.onSubmit(this.state.value, this.state.name);
        } else {
            this.props.onSubmit(JSON.parse(this.state.value), this.state.name);
        }
    }

    render(): JSX.Element {
        const submitText = this.props.name ? "Save" : "Add";

        const selectOptions = ["string", "object", "array"];

        return <form onSubmit={this.submitForm}>
            <label htmlFor="variable-name">Name ([a-Z][a-Z0-9]*)</label>
            <div className="input-group">
                <input type="text" className="form-control" pattern="\w[\w\d]*" required id="variable-name" readOnly={this.props.name !== null && this.props.name !== undefined && this.props.name !== ""} value={this.state.name} onChange={this.setName} />
            </div>

            <label htmlFor="variable-type">Type of variable</label>
            <div className="input-group">
                <Select hideEmpty={true} id="variable-type" value={this.state.type} onOptionSelect={this.setType} values={selectOptions}></Select>
            </div>

            <label htmlFor="variable-value">Value</label>
            <div className="input-group">
                <input type="text" className="form-control" required id="variable-value" value={this.state.value} onChange={this.setValue} />
            </div>

            <div className="input-group">
                <button type="submit" className="btn btn-primary" onClick={this.submitForm}>{submitText}</button>
            </div>
        </form>
    }
}

export default VariableForm;