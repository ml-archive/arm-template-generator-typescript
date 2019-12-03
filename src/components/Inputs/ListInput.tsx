import { Component, Fragment, ChangeEvent } from "react";
import React = require("react");

interface ListInputProps {
    initialValue: any[];
    label: string;
    type: string;
    onChange: (value: any[]) => void;
}

class ListInputState {
    value: any[];
}

export class ListInput extends Component<ListInputProps, ListInputState> {
    constructor(props: ListInputProps) {
        super(props);

        this.addValue = this.addValue.bind(this);
        this.removeValue = this.removeValue.bind(this);
        this.updateValue = this.updateValue.bind(this);

        let state = new ListInputState();
        if(props.initialValue) {
            state.value = props.initialValue;
        } else {
            state.value = [""];
        }

        this.state = state;
    }

    componentDidUpdate(prevProps: ListInputProps) {
        if(this.props.type !== prevProps.type) {
            if((this.props.type === "number" && typeof(this.state.value[0]) === "number")
            || this.props.type === "text" && typeof(this.state.value[0]) === "string") {
                return;
            }

            this.setState({
                value: [""]
            });

            this.props.onChange([""]);
        }

        if(this.props.initialValue !== prevProps.initialValue) {
            this.setState({
                value: this.props.initialValue
            });

            this.props.onChange(this.props.initialValue);
        }
    }

    addValue(): void {
        let values = this.state.value;
        values.push("");

        this.setState({
            value: values
        });
    }

    removeValue(index: number): void {
        let values = this.state.value;
        values.splice(index, 1);

        this.setState({
            value: values
        });

        this.props.onChange(values);
    }

    updateValue(event: ChangeEvent<HTMLInputElement>, index: number) {
        let values = this.state.value;
        values[index] = this.props.type === "number" ? Number(event.currentTarget.value) : event.currentTarget.value;

        this.setState({
            value: values
        });

        this.props.onChange(values);
    }

    render() {
        return <Fragment>
            <label>{this.props.label}</label>
            {this.state.value.map((value, index) => {
                return <div key={index} className="input-group">
                    <input type={this.props.type} value={value} className="form-control" onChange={(event) => this.updateValue(event, index)} />
                    <div className="input-group-append">
                        <button type="button" className="btn btn-outline-primary" onClick={() => this.removeValue(index)}>Remove</button>
                    </div>
                </div>
            })}
            <div className="input-group">
                <button type="button" onClick={this.addValue} className="btn btn-primary">Add new value</button>
            </div>
        </Fragment>
    }
}

export default ListInput;