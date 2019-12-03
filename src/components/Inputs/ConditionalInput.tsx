import { Component, Fragment, ChangeEvent } from "react";
import React = require("react");

interface ConditionalInputProps {
    onChange: (value: any) => void;
    type: string;
    initialValue: any;
    conditionalLabel: string;
    valueLabel: string;
    requiredWhenOpen: boolean;
    id: string;
}

class ConditionalInputState {
    showInput: boolean;
    value: any;
}

export class ConditionalInput extends Component<ConditionalInputProps, ConditionalInputState> {
    constructor(props: ConditionalInputProps) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);

        let state = new ConditionalInputState();
        state.showInput = !!props.initialValue;
        state.value = props.initialValue === null || props.initialValue === undefined ? "" : props.initialValue;

        this.state = state;
    }

    componentDidUpdate(prevProps: ConditionalInputProps) {
        if(this.props.initialValue !== prevProps.initialValue) {
            this.setState({
                value: this.props.initialValue,
                showInput: !!this.props.initialValue
            });
        }
    }

    onChange(event: ChangeEvent<HTMLInputElement>) {
        let value: any;

        if(this.props.type === "number") {
            value = Number(event.currentTarget.value);
        } else if(this.props.type === "bool") {
            value = event.currentTarget.checked;
        } else {
            value = event.currentTarget.value;
        }

        this.props.onChange(value);
        this.setState({
            value: value
        });
    }

    toggleVisibility(event: ChangeEvent<HTMLInputElement>) {
        this.setState({
            showInput: event.currentTarget.checked
        });

        if(event.currentTarget.checked === false) {
            this.setState({
                value: ""
            });

            this.props.onChange("");
        }
    }

    render() {
        const conditionalId = this.props.id + "-conditional";

        return <Fragment>
            <div className="input-group">
                <label htmlFor={conditionalId}>
                    <input type="checkbox" id={conditionalId} checked={this.state.showInput} onChange={this.toggleVisibility} /> {this.props.conditionalLabel}
                </label>
            </div>

            {this.state.showInput && this.props.type !== "bool" &&
            <Fragment><label htmlFor={this.props.id}>{this.props.valueLabel}</label>
                <div className="input-group">
                    <input type={this.props.type} id={this.props.id} required={this.props.requiredWhenOpen} value={this.state.value} className="form-control" onChange={this.onChange} />
                </div>
            </Fragment>}

            {this.state.showInput && this.props.type === "bool" &&
            <div className="input-group">
                <label htmlFor={this.props.id}>
                    <input type="checkbox" id={this.props.id} checked={this.state.value} onChange={this.onChange} /> {this.props.valueLabel}
                </label>
            </div>}
        </Fragment>
    }
}

export default ConditionalInput;