import { Component, Fragment } from "react";
import ScriptHelper, { ScriptContextType } from "./ScriptHelper";
import ArmTemplate from "../../models/ArmTemplate";
import React = require("react");

interface ConcatScriptProps {
    template: ArmTemplate;
    context: ScriptContextType;
    onChange: (value: string) => void;
}

class ConcatScriptState {
    firstHalf: string;
    secondHalf: string;
}

export class ConcatScript extends Component<ConcatScriptProps, ConcatScriptState> {
    constructor(props: ConcatScriptProps) {
        super(props);

        let state = new ConcatScriptState();
        state.firstHalf = "";
        state.secondHalf = "";

        this.state = state;
    }

    onChange(value: string, isFirstHalf: boolean) {
        let firstHalf: string = this.state.firstHalf;
        let secondHalf: string = this.state.secondHalf;

        if(isFirstHalf === true) {
            firstHalf = value;
            this.setState({
                firstHalf: value
            });
        } else {
            secondHalf = value;
            this.setState({
                secondHalf: value
            });
        }

        this.props.onChange("concat(" + firstHalf + "," + secondHalf + ")");
    }

    render() {
        return <Fragment>
            <label>First half</label>
            <ScriptHelper context={this.props.context} includeText={true} template={this.props.template} topLevel={false} onChange={(value) => { this.onChange(value, true) }}></ScriptHelper>
            <label>Second half</label>
            <ScriptHelper context={this.props.context} includeText={true} template={this.props.template} topLevel={false} onChange={(value) => { this.onChange(value, false) }}></ScriptHelper>
        </Fragment>
    }
}

export default ConcatScript;