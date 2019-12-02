import { Parameter } from "./Parameter";
import Variable from "./Variable";
import Resource from "./Resource";

export class ArmTemplate {
    Parameters: { [index: string]: Parameter };
    Variables: { [index: string]: Variable };
    Resources: Resource[];

    constructor() {
        this.Parameters = {};
        this.Variables = {};
        this.Resources = [];
    }
}

export default ArmTemplate;