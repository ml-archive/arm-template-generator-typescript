import * as React from "react";
import { Component, Fragment } from 'react';
import ArmTemplate from "../models/ArmTemplate";
import ParameterForm from "./WorkingWindow/ParameterForm";
import Parameter from "../models/Parameter";
import ScriptHelper, { ScriptContextType } from "./ScriptHelper/ScriptHelper";
import Modal from "./Modal";
import VariableForm from "./WorkingWindow/VariableForm";

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
    onSubmitParameter: (parameter: Parameter, name: string) => void;
    onSubmitVariable: (variable: string | object | object[], name: string) => void;
    window: Windows;
    editKey?: string;
}

class WorkingWindowState {
    showModal: boolean;
}

export class WorkingWindow extends Component<WorkingWindowProps, WorkingWindowState> {
    constructor(props: WorkingWindowProps) {
        super(props);

        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);

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

    closeModal(): void {
        this.setState({
            showModal: false
        });
    }

    openModal(): void {
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

        return (<Fragment>
                <div className="row">
                    <div className="col">
                        <h2>{headline}</h2>
                    </div>
                    {showScriptHelper && <div className="col text-right">
                        <button className="btn btn-primary" onClick={this.openModal}>Open script helper</button>
                    </div>}
                </div>
                {this.props.window === Windows.AddParameter && <ParameterForm onSubmit={this.props.onSubmitParameter}></ParameterForm> }
                {this.props.window === Windows.EditParameter && <ParameterForm parameter={this.props.template.parameters[this.props.editKey]} name={this.props.editKey} onSubmit={this.props.onSubmitParameter}></ParameterForm>}
                {this.props.window === Windows.AddVariable && <VariableForm onSubmit={this.props.onSubmitVariable}></VariableForm>}
                {this.props.window === Windows.EditVariable && <VariableForm initialValue={this.props.template.variables[this.props.editKey]} name={this.props.editKey} onSubmit={this.props.onSubmitVariable}></VariableForm>}
                {showScriptHelper && <Modal closeModal={this.closeModal} show={this.state.showModal} headline="Script helper">
                    <ScriptHelper topLevel={true} template={this.props.template} context={scriptContextType}></ScriptHelper>
                </Modal>
            }
            </Fragment>)
    }
}

export default WorkingWindow;