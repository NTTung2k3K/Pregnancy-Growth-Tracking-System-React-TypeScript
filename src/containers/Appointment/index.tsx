import { useForm, Controller } from "react-hook-form";

const AppointmentContainer = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      service: "Financial Planning",
      date: "",
      time: "12:00",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form Data Submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-[#F3F2F2] mx-32 my-10 py-2">
        <div className="relative mx-auto mt-20 mb-20 max-w-screen-lg overflow-hidden rounded-t-xl bg-emerald-400/60 py-32 text-center shadow-xl shadow-gray-300">
          <h1 className="mt-2 px-8 text-3xl font-bold text-sky-900 md:text-5xl">
            Book an appointment
          </h1>
          <p className="mt-6 text-lg text-sky-900">
            Get an appointment with our experienced accountants
          </p>
        </div>

        <div className="mx-auto grid max-w-screen-lg px-6 pb-20">
          <div>
            <p className=" text-xl font-bold text-sky-900">Select a service</p>
            <div className="mt-4 grid max-w-3xl gap-x-4 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
              {[
                "Financial Planning",
                "Retirement Planning",
                "Investment Advice",
              ].map((service, index) => (
                <div className="relative" key={service}>
                  <input
                    className="peer hidden"
                    id={`radio_${index + 1}`}
                    type="radio"
                    value={service}
                    {...register("service", {
                      required: "Please select a service",
                    })}
                  />
                  <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white peer-checked:border-emerald-400" />
                  <label
                    className="flex h-full cursor-pointer flex-col rounded-lg p-4 shadow-lg shadow-slate-100 peer-checked:bg-emerald-600 peer-checked:text-white"
                    htmlFor={`radio_${index + 1}`}
                  >
                    <span className="mt-2 font-medium">{service}</span>
                    <span className="text-xs uppercase">1 Hour</span>
                  </label>
                </div>
              ))}
            </div>
            {errors.service && (
              <p className="mt-2 text-sm text-red-600">
                {errors.service.message}
              </p>
            )}
          </div>

          <div>
            <p className="mt-8  text-xl font-bold text-sky-900">
              Select a date
            </p>
            <div className="relative mt-4 w-56">
              <Controller
                name="date"
                control={control}
                rules={{ required: "Please select a date" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    className="datepicker-input block w-full rounded-lg border border-emerald-300 bg-emerald-50 p-2.5 pl-10 text-emerald-800 outline-none ring-opacity-30 placeholder:text-emerald-800 focus:ring focus:ring-emerald-300 sm:text-sm"
                    placeholder="Select date"
                  />
                )}
              />
            </div>
            {errors.date && (
              <p className="mt-2 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <p className="mt-8 text-xl font-bold text-sky-900">Select a time</p>
            <div className="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl">
              {["12:00", "14:00", "09:00", "15:00"].map((time, index) => (
                <div className="relative" key={time}>
                  <input
                    className="peer hidden"
                    id={`time_${index + 1}`}
                    type="radio"
                    value={time}
                    {...register("time", { required: "Please select a time" })}
                  />
                  <label
                    className="flex items-center justify-center h-full pb-2 cursor-pointer flex-col rounded-lg  shadow-lg shadow-slate-100 peer-checked:bg-emerald-600 peer-checked:text-white border border-emerald-400 peer-checked:border-none"
                    htmlFor={`time_${index + 1}`}
                  >
                    <span className="mt-2 font-medium">{time}</span>
                  </label>
                </div>
              ))}
            </div>
            {errors.time && (
              <p className="mt-2 text-sm text-red-600">{errors.time.message}</p>
            )}
          </div>

          <div className="flex items-center justify-center mt-20">
            <button
              type="submit"
              className="w-56 rounded-full border-8 border-emerald-500 bg-emerald-600 px-10 py-4 text-lg font-bold text-sky-900 transition hover:translate-y-1 hover:border-emerald-600 hover:bg-emerald-500"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AppointmentContainer;
