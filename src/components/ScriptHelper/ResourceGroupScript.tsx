import { Component } from "react";
import React = require("react");
import Select from "../Inputs/Select";

interface ResourceGroupScriptProps {
    onChange: (value: string) => void;
}

class ResourceGroupScriptState {
    value: string;
}

export class ResourceGroupScript extends Component<ResourceGroupScriptProps, ResourceGroupScriptState> {
    constructor(props: ResourceGroupScriptProps) {
        super(props);

        this.onChange = this.onChange.bind(this);

        let state = new ResourceGroupScriptState();
        state.value = "";

        this.state = state;
    }

    onChange(option: string) {
        if(option.length > 0) {
            this.props.onChange("resourceGroup()." + option)
        } else {
            this.props.onChange("");
        }

        this.setState({
            value: option
        });
    }

    render() {
        const options = ["id", "name", "type", "location", "managedBy"];

        return <div className="input-group">
            <Select onOptionSelect={this.onChange} values={options} value={this.state.value}></Select>
        </div>
    }
}