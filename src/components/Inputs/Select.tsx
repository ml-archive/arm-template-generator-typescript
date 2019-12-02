import { Component, ChangeEvent } from "react";
import React = require("react");

export interface SelectProps {
    values: string[];
    onOptionSelect?: (option: string) => void;
    id?: string;
    value?: string;
}

class SelectState {
    selectedValue: string;
}

export class Select extends Component<SelectProps, SelectState> {
    constructor(props: SelectProps) {
        super(props);

        this.onOptionSelected = this.onOptionSelected.bind(this);
        let state = new SelectState();

        if(this.props.value) {
            state.selectedValue = this.props.value;
        }

        this.state = state;
    }

    onOptionSelected (event: ChangeEvent<HTMLSelectElement>) {
        const value = event.currentTarget.value;

        this.setState({
            selectedValue: value
        });

        if(this.props.onOptionSelect) {
            this.props.onOptionSelect(value);
        }
    }

    render() {
        return (<select id={this.props.id} className="form-control" onChange={this.onOptionSelected} value={this.state.selectedValue}>
            <option></option>
            {this.props.values.map((value) => {
                return <option key={value} value={value}>{value}</option>;
            })};
        </select>)
    }
}

export default Select;