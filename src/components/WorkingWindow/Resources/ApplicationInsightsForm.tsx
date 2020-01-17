import { ResourceTypeForm, ResourceTypeFormState, ResourceTypeFormProps } from "./ResourceTypeForm";
import ApplicationInsights, { ApplicationInsightsProperties } from "../../../models/Resources/ApplicationInsights";
import Parameter from "../../../models/Parameter";
import { Fragment } from "react";
import React = require("react");
import ResourceInput from "../../Inputs/ResourceInput";
import Select from "../../Inputs/Select";

class ApplicationInsightsFormState extends ResourceTypeFormState {
    kind: string;
    kindParameterName: string;
    applicationType: string;
    applicationTypeParameterName: string;
}

export class ApplicationInsightsForm extends ResourceTypeForm<ApplicationInsights, ApplicationInsightsFormState> {
    constructor(props: ResourceTypeFormProps<ApplicationInsights>) {
        super(props);

        this.onKindUpdated = this.onKindUpdated.bind(this);
        this.onKindParameterNameUpdated = this.onKindParameterNameUpdated.bind(this);
        this.onApplicationTypeUpdated = this.onApplicationTypeUpdated.bind(this);
        this.onApplicationTypeParameterNameUpdated = this.onApplicationTypeParameterNameUpdated.bind(this);

        let state = this.getBaseState(props);

        state.kind = "";
        state.kindParameterName = "";
        state.applicationType = "";
        state.applicationTypeParameterName = "";

        if(props.resource) {
            if(props.resource.kind) {
                state.kind = props.resource.kind;
            }

            if(props.resource.properties && props.resource.properties.Application_Type) {
                state.applicationType = props.resource.properties.Application_Type;
            }
        }

        this.state = state;
    }

    protected getNewState(): ApplicationInsightsFormState {
        return new ApplicationInsightsFormState();
    }
    
    protected getNewResource(): ApplicationInsights {
        return new ApplicationInsights();
    }

    getDependencies(): import("../../../models/Resources/ResourceDependency").ResourceDependency {
        return ApplicationInsights.getResourceDependencyModel();
    }

    protected setSpecificInformation(resource: ApplicationInsights): void {
        resource.kind = this.state.kindParameterName
            ? this.getParameterString(this.state.kindParameterName)
            : this.state.kind;

        if(!resource.properties) {
            resource.properties = new ApplicationInsightsProperties();
        }

        resource.properties.Application_Type = this.state.applicationTypeParameterName
            ? this.getParameterString(this.state.applicationTypeParameterName)
            : this.state.applicationType;
    }

    protected getSpecificNewParameters(): { [index: string]: Parameter; } {
        let parametersToCreate: { [index: string]: Parameter; } = {};

        this.createParameter(this.state.kindParameterName, this.state.kind, "string", ApplicationInsights.allowedKinds, parametersToCreate);

        this.createParameter(this.state.applicationTypeParameterName, this.state.applicationType, "string", ApplicationInsightsProperties.allowedApplicationTypes, parametersToCreate);

        return parametersToCreate;
    }

    onKindUpdated(kind: string): void {
        this.setState({
            kind: kind
        });
    }

    onKindParameterNameUpdated(name: string): void {
        this.setState({
            kindParameterName: name
        });
    }

    onApplicationTypeUpdated(applicationType: string): void {
        this.setState({
            applicationType: applicationType
        });
    }

    onApplicationTypeParameterNameUpdated(name: string): void {
        this.setState({
            applicationTypeParameterName: name
        });
    }

    getSpecificMarkup(): JSX.Element {
        const parameters = Object.keys(this.props.template.parameters);
        const variables = Object.keys(this.props.template.variables);

        return <Fragment>
            <h3>Kind*</h3>
            <ResourceInput id="resource-kind" parameters={parameters} variables={variables} value={this.state.kind} onNewParameterNameChanged={this.onKindParameterNameUpdated} onValueUpdated={this.onKindUpdated}>
                <Select id="resource-kind" values={ApplicationInsights.allowedKinds} required={true} onOptionSelect={this.onKindUpdated} value={this.state.kind}></Select>
            </ResourceInput>

            <h3>Application Type*</h3>
            <ResourceInput id="resource-application-type" parameters={parameters} variables={variables} value={this.state.applicationType} onValueUpdated={this.onApplicationTypeUpdated} onNewParameterNameChanged={this.onApplicationTypeParameterNameUpdated}>
                <Select id="resource-application-type" values={ApplicationInsightsProperties.allowedApplicationTypes} required={true} onOptionSelect={this.onApplicationTypeUpdated} value={this.state.applicationType}></Select>
            </ResourceInput>
        </Fragment>
    }
}

export default ApplicationInsightsForm;