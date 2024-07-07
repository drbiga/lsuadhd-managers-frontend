import { Button } from "@/components/Button";
import { DarkModeButton } from "@/components/DarkModeButton";
import { useAuth } from "@/hooks/auth";
import iamService from "@/services/iam";
// import { InvalidCredentialsError } from "@/services/auth";
import { useCallback, useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { login, authState } = useAuth();


  useEffect(() => {
    if (authState.isLoggedIn) {
      navigate('/')
    }
  }, [authState])

  const onSubmit = useCallback(async (data: FieldValues) => {
    try {
      const session = await login({ username: data.username, password: data.password });
      if (session) {
        const contexts = await iamService.searchContexts(session.user.role);
        if (contexts.map(c => c.name).includes('management')) {
          navigate('/management')
        } else {
          navigate('/')
        }
      } else {
        navigate('/login')
      }
    } catch (error) {
      toast.error('Unknown error. Please contact someone');
      reset();
    }
  }, [authState, login]);

  return (
    <div
      className="h-[100vh] w-[100vw] bg-background flex flex-col items-center justify-center relative"
    >
      <img className="bg-background" src="meta-symbol.png" width="200px" alt="" />
      <div className="bg-primary-foreground border-[1px] border-slate-500 dark:border-slate-300 rounded-lg p-4 text-slate-200 flex flex-col gap-4">
        <div>
          <h1 className="text-xl text-slate-800 dark:text-slate-200">Welcome back!</h1>
          <p className="text-slate-400 dark:text-slate-600">To the best time of your life</p>
        </div>
        <div>
          <h2 className="mb-2 text-slate-800 dark:text-slate-200">Who are you?</h2>

          <form className="flex flex-col gap-4 p-2" onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="flex flex-col gap-2">
              <input
                id="name"
                className="w-[250px] px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 focus:bg-primary dark:focus:bg-slate-700"
                type="text"
                placeholder="Name..."
                {...register("username", { required: true })}
              />
              {errors.email && (
                <p className="text-red-600">Name required</p>
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <input
                id="password"
                className="w-[250px] px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 focus:bg-primary dark:focus:bg-slate-700"
                type="password"
                placeholder="Password..."
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p className="text-red-600">Password is required</p>
              )}
            </fieldset>

            <div className="flex justify-around">
              <DarkModeButton />
              <Button type="submit">Log In</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}