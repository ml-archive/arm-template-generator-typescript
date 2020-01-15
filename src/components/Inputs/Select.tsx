import { Component, ChangeEvent } from "react";
import React = require("react");

interface SelectProps {
    values: string[];
    onOptionSelect?: (option: string) => void;
    id?: string;
    value?: string;
    required?: boolean;
    hideEmpty?: boolean;
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

    componentDidUpdate(prevProps: SelectProps): void {
        if(prevProps.value === this.props.value) {
            return;
        }

        this.setState({
            selectedValue: this.props.value
        });
    }

    onOptionSelected (event: ChangeEvent<HTMLSelectElement>): void {
        const value = event.currentTarget.value;

        this.setState({
            selectedValue: value
        });

        if(this.props.onOptionSelect) {
            this.props.onOptionSelect(value);
        }
    }

    render(): JSX.Element {
        return (<select required={this.props.required} id={this.props.id} className="form-control" onChange={this.onOptionSelected} value={this.state.selectedValue}>
            {!this.props.hideEmpty && <option></option>}
            {this.props.values.map((value) => {
                return <option key={value} value={value}>{value}</option>;
            })};
        </select>)
    }
}

export default Select;