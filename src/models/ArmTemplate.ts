import { Parameter } from "./Parameter";
import Resource from "./Resource";
import Output from "./Output";

export class ArmTemplate {
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