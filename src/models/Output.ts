export class Output {
    condition: string;
    type: string;
    value: string | string[] | number | number[] | object | object[] | boolean;

    static allowedTypes: string[] = ["bool", "string", "securestring", "int", "object", "secureObject", "array"];
}

export default Output;