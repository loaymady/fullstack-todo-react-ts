export interface IRegisterInput {
  name: "email" | "username" | "password";
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
  };
}
export interface ErrorResponse {
  error: {
    // details?: {};
    message?: string;
  };
}

export interface ILoginInput {
  name: "identifier" | "password";
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
  };
}

export interface ITodo {
  id: number;
  title: string;
  description: string;
}
