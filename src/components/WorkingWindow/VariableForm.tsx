import { Component } from "react";

interface VariableFormProps {
    
}

class VariableFormState {

}

export class VariableForm extends Component<VariableFormProps, VariableFormState> {
    constructor(props: VariableFormProps) {
        super(props);

        let state = new VariableFormState();

        this.state = state;
    }


}

export default VariableForm;