import { Parameter } from "./Parameter";
import Variable from "./Variable";

export class ArmTemplate {
    Parameters: { [index: string]: Parameter };
    Variables: { [index: string]: Variable };

    constructor() {
        this.Parameters = {};
        this.Variables = {};
    }
}

export default ArmTemplate;