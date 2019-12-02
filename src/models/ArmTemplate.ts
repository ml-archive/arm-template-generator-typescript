import { Parameter } from "./Parameter";
import Variable from "./Variable";
import Resource from "./Resource";

export class ArmTemplate {
    parameters: { [index: string]: Parameter };
    variables: { [index: string]: Variable };
    resources: Resource[];

    constructor() {
        this.parameters = {};
        this.variables = {};
        this.resources = [];
    }
}

export default ArmTemplate;