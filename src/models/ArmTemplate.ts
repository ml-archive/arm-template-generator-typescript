import { Parameter } from "./Parameter";
import Variable from "./Variable";
import Resource from "./Resource";

export class ArmTemplate {
    parameters: { [index: string]: Parameter };
    variables: { [index: string]: Variable };
    resources: Resource[];
    outputs: { [index: string]: any };

    constructor() {
        this.parameters = {};
        this.variables = {};
        this.resources = [];
        this.outputs = {};
    }
}

export default ArmTemplate;