import * as React from "react";
import { Component, Fragment } from 'react';
import ArmTemplate from "../models/ArmTemplate";
import ParameterForm from "./WorkingWindow/ParameterForm";
import Parameter from "../models/Parameter";
import ScriptHelper, { ScriptContextType } from "./ScriptHelper/ScriptHelper";

export enum Windows {
    AddParameter,
    EditParameter,
    AddVariable,
    EditVariable,
    AddResource,
    EditResource,
    AddOutput,
    EditOutput,
    None
}

interface WorkingWindowProps {
    template: ArmTemplate;
    onAddParameter: (parameter: Parameter, name: string) => void;
    window: Windows;
    editKey?: string;
}

class WorkingWindowState {
    showModal: boolean;
}

export class WorkingWindow extends Component<WorkingWindowProps, WorkingWindowState> {
    constructor(props: WorkingWindowProps) {
        super(props);

        this.closeScriptHelper = this.closeScriptHelper.bind(this);
        this.openScriptHelper = this.openScriptHelper.bind(this);

        let state = new WorkingWindowState();
        state.showModal = false;

        this.state = state;
    }

    getHeadline(currentWindow: Windows, key?: string): string {
        switch(currentWindow) {
            case Windows.AddOutput:
                return "Add output";
            case Windows.AddParameter:
                return "Add parameter";
            case Windows.AddResource:
                return "Add resource";
            case Windows.AddVariable:
                return "Add variable";
            case Windows.EditOutput:
                return "Edit output: " + key;
            case Windows.EditParameter:
                return "Edit parameter: " + key;
            case Windows.EditResource:
                return "Edit resource: " + key;
            case Windows.EditVariable:
                return "Edit variable: " + key;
            case Windows.None:
                return "Select something in the menu";
        }

        return "Unknown window selected";
    }

    closeScriptHelper(): void {
        this.setState({
            showModal: false
        });
    }

    openScriptHelper(): void {
        this.setState({
            showModal: true
        });
    }

    render() {
        let headline: string = this.getHeadline(this.props.window, this.props.editKey);

        let showScriptHelper: boolean = false;
        let scriptContextType: ScriptContextType;

        if(this.props.window === Windows.AddVariable || this.props.window === Windows.EditVariable) {
            showScriptHelper = true;
            scriptContextType = ScriptContextType.Variables;
        }

        if(this.props.window === Windows.AddResource || this.props.window === Windows.EditResource) {
            showScriptHelper = true;
            scriptContextType = ScriptContextType.Resources;
        }

        const modalClass = this.state.showModal ? "modal show" : "modal";

        return (<Fragment>
                <div className="row">
                    <div className="col">
                        <h2>{headline}</h2>
                    </div>
                    <div className="col text-right">
                        <button className="btn btn-primary" onClick={this.openScriptHelper}>Open script helper</button>
                    </div>
                </div>
                {this.props.window === Windows.AddParameter && <ParameterForm parameter={null} onSubmit={this.props.onAddParameter}></ParameterForm> }
                {this.props.window === Windows.EditParameter && <ParameterForm parameter={this.props.template.parameters[this.props.editKey]} name={this.props.editKey} onSubmit={this.props.onAddParameter}></ParameterForm>}
                {showScriptHelper && <div className={modalClass} tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Script helper</h5>
                                <button type="button" className="close" onClick={this.closeScriptHelper} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="modal-body">
                                <ScriptHelper topLevel={true} template={this.props.template} context={scriptContextType}></ScriptHelper>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-primary" type="button" onClick={this.closeScriptHelper}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            </Fragment>)
    }
}

export default WorkingWindow;