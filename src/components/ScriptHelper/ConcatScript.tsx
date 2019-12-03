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
    values: string[];
}

export class ConcatScript extends Component<ConcatScriptProps, ConcatScriptState> {
    constructor(props: ConcatScriptProps) {
        super(props);

        let state = new ConcatScriptState();
        state.values = ["", ""];

        this.state = state;

        this.addPart = this.addPart.bind(this);
        this.onChange = this.onChange.bind(this);
        this.removePart = this.removePart.bind(this);
    }

    addPart(): void {
        let values = this.state.values;

        values.push("");

        this.setState({
            values: values
        });

        this.props.onChange(this.getRenderedString(values));
    }

    getRenderedString(values: string[]): string {
        return "concat(" + values.join(",") + ")";
    }

    onChange(value: string, index: number): void {
        let values = this.state.values;

        values[index] = value;

        this.setState({
            values: values
        });

        this.props.onChange(this.getRenderedString(values));
    }

    removePart(): void {
        let values = this.state.values;

        values.pop();

        this.setState({
            values: values
        });

        this.props.onChange(this.getRenderedString(values));
    }

    render() {
        return <Fragment>
            {this.state.values.map((_value, index) => {
                return <Fragment key={index}>
                    <label><strong>part {index + 1}</strong></label>
                    <ScriptHelper context={this.props.context} includeText={true} template={this.props.template} topLevel={false} onChange={(value) => { this.onChange(value, index) }}></ScriptHelper>
                </Fragment>
            })}

            <div className="input-group">
                <button type="button" className="btn btn-primary" onClick={this.addPart}>Add</button>
                {this.state.values.length > 2 && <button type="button" className="btn btn-danger" onClick={this.removePart}>Remove</button>}
            </div>
        </Fragment>
    }
}

export default ConcatScript;