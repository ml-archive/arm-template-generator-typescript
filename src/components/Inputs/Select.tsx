import { Component, ChangeEvent } from "react";
import React = require("react");

export interface SelectProps {
    values: string[];
    onOptionSelect?: (option: string) => void;
}

class SelectState {
    selectedValue: string;
}

export class Select extends Component<SelectProps, SelectState> {
    constructor(props: SelectProps) {
        super(props);

        this.onOptionSelected = this.onOptionSelected.bind(this);
    }

    onOptionSelected (event: ChangeEvent<HTMLSelectElement>) {
        if(this.props.onOptionSelect) {
            this.props.onOptionSelect(event.currentTarget.value);
        }
    }

    render() {
        return (<select className="form-control" onChange={this.onOptionSelected}>
            <option></option>
            {this.props.values.map((value) => {
                return <option key={value} value={value}>{value}</option>;
            })};
        </select>)
    }
}

export default Select;