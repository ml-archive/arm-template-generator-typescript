import { Parameter } from "./Parameter";
import Resource from "./Resource";
import Output from "./Output";

export class ArmTemplate {
    $schema: string = "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#";
    contentVersion: string = "1.0.0.0";
    parameters: { [index: string]: Parameter };
    variables: { [index: string]: string | object | object[] };
    resources: Resource[];
    outputs: { [index: string]: Output };

    constructor() {
        this.parameters = {};
        this.variables = {};
        this.resources = [];
        this.outputs = {};
    }
}

export default ArmTemplate;