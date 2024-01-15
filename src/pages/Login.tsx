import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { LoginSchema } from "../validation/SchemaYub";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../config/axios.config";
import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ErrorResponse } from "../interfaces";
import { LOGIN_FORM } from "../data";
import ErrorMsg from "../components/ui/ErrorMsg";

interface IFormInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: login,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      const { data: resData } = await axiosInstance.post("/auth/local", data);
      console.log(resData);
      toast.success("You will navigate to the home page after 2 seconds!", {
        position: "bottom-center",
        duration: 1500,
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fit-content",
        },
      });
      localStorage.setItem("loggedInUser", JSON.stringify(resData));
      setTimeout(() => {
        location.replace("/");
      }, 2000);
    } catch (error) {
      const errorObj = error as AxiosError<ErrorResponse>;
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

  // Renders
  const renderLoginForm = LOGIN_FORM.map(
    ({ placeholder, name, type, validation }, index) => {
      return (
        <div key={index}>
          <Input
            type={type}
            placeholder={placeholder}
            {...login(name, validation)}
          />
          {errors?.[name] && <ErrorMsg msg={errors[name]?.message} />}
        </div>
      );
    }
  );

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginForm}
        <Button isLoading={isLoading} fullWidth>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
