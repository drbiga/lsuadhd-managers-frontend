import { FieldValues, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

interface UserSelectionProps {
  studentNames: string[];
  setSelectedStudentName: React.Dispatch<React.SetStateAction<string>>;
}

export default function UserSelection(props: UserSelectionProps) {
  // const { studentNames, setSelectedStudentName } = props;

  const navigate = useNavigate();

  const style = { backgroundColor: '#0000' };

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    //   const session = await login({ email: data.email, password: data.password });
    //   if (session) {
    //       navigate("/business");
    //   } else {
    //     // toast.error("Invalid Credentials");
    //     reset();
    //   }
  };

  return (
    <div
      // style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}
      className="container d-flex flex-column align-items-center justify-content-center"
    >
      {/* Black overlay */}
      <div style={{ backgroundColor: '#000a', zIndex: 1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}></div>
      <video
        autoPlay
        loop
        muted
        style={{ overflow: 'hidden', maxWidth: '100%', position: 'absolute', zIndex: 0 }}
      >
        <source
          src="video.mp4"
          type="video/mp4"
          style={{ overflow: 'hidden' }}
        ></source>
      </video>
      <div
        style={{ zIndex: 2, color: '#fff', ...style }}
      >
        <h1 className="text-xl">Welcome back!</h1>
        <div style={style}>
          <p style={{ color: '#ddda', ...style }}>To the best time of your life</p>
          <h2 style={{ fontSize: '1.2em', ...style }}>Who are you?</h2>

          {/* <form className="flex flex-col gap-4 p-2" onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="flex flex-col gap-2">
              <input
                className="w-[250px] px-4 py-2 rounded-lg bg-primary focus:bg-primary hover:bg-gray-800 focus:border-[1px] focus:border-gray-800"
                type="email"
                placeholder="Email..."
                {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
              />
              {errors.email && (
                <p className="text-red-600">Email is required and must be valid</p>
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <input
                id="password"
                className="w-[250px] px-4 py-2 rounded-lg bg-primary focus:bg-primary hover:bg-gray-800 focus:border-[1px] focus:border-gray-800"
                type="password"
                placeholder="Password..."
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p className="text-red-600">Password is required</p>
              )}
            </fieldset>

            <div className="flex gap-4 justify-center items-center">
              <Link
                className="p-2 w-[100px] text-center rounded-md border-[1px] border-gray-800 transition-all duration-100 hover:bg-primary focus:bg-primary"
                to="/signup"
              >
                Sign Up
              </Link>
              <button
                className="p-2 w-[100px] text-center rounded-md border-[1px] border-gray-800 transition-all duration-100 hover:bg-primary focus:bg-primary"
                type="submit"
              >
                Log In
              </button>
            </div>
          </form> */}
          {/* <ul style={{listStyle: "none", ...style}}>
                        {studentNames.map((name) => (
                            <li className="mb-1" key={name} style={style}>
                                <button className="btn btn-primary container" onClick={() => {
                                    setSelectedStudentName(name);
                                }}>{name}</button>
                            </li>
                        ))}
                    </ul> */}
        </div>
      </div>
    </div>
  )
}