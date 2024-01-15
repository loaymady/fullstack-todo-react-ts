import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ErrorMsg from "../components/ui/ErrorMsg";
import { REGISTER_FORM } from "../data";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterSchema } from "../validation/SchemaYub";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { ErrorResponse } from "../interfaces";
import { useNavigate } from "react-router-dom";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const navigateToLogin = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(RegisterSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);

    try {
     await axiosInstance.post("/auth/local/register", data);
      toast.success(
        "You will navigate to the login page after 2 seconds to login!",
        {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        }
      );
      setTimeout(() => {
        navigateToLogin("/login");
      }, 2000);
    } catch (error) {
      const errorObj = error as AxiosError<ErrorResponse>;
      // console.log(errorObj.response?.data.error.message);
      toast.error(`${errorObj.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 1500,
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(errors);

  // Renders
  const renderResgisterForm = REGISTER_FORM.map(
    ({ placeholder, name, type, validation }, index) => {
      return (
        <div key={index}>
          <Input
            type={type}
            placeholder={placeholder}
            {...register(name, validation)}
          />
          {errors?.[name] && <ErrorMsg msg={errors[name]?.message} />}
        </div>
      );
    }
  );

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderResgisterForm}
        <Button isLoading={isLoading} fullWidth>
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
