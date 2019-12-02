import { Component } from "react";
import React = require("react");

export interface SelectProps {
    values: string[];
}

class SelectState {
    selectedValue: string;
}

export class Select extends Component<SelectProps, SelectState> {
    constructor(props: SelectProps) {
        super(props);
    }

    render() {
        return (<select>
            {this.props.values.map((value) => {
                return <option>{value}</option>;
            })};
        </select>)
    }
}

export default Select;