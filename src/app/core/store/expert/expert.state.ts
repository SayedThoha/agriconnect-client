export const expert_state={
    expertInfo:{
        _id:'',
        firstName:'',
        lastName:'',
        email:'',
        role:'',
    }
}

export interface expert_state{
    expertInfo: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
}

export const initialExpertState: expert_state = {
    
    expertInfo: {
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
    }
};