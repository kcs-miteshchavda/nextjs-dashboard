'use client'
import _ from "lodash";
import { ArrowRightIcon, AtSymbolIcon, KeyIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { lusitana } from "../ui/fonts";
import { Button } from "../ui/button";
import Link from "next/link";
import MndsLogo from "../ui/mnds-logo";
import { SubmitHandler, useForm } from "react-hook-form";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { createUser, encryptPassword } from "../lib/actions";
import { getUsers } from "../lib/data";

type User = {
    id: string,
    name: string,
    email: string,
    password: string,
    confirmPassword?: string,
};

export default function Page() {
    // const [formData, setFormData] = useState({});
    // const [errors, setErrors] = useState({});
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setError
    } = useForm<User>();
    const router = useRouter();
    // const onSubmit: SubmitHandler<User> = (data) => console.log(data);
    const onSubmit: SubmitHandler<User> = async (formData) => {
        const users = await getUsers();

        // user already exists.
        if (!_.isEmpty(users) && users.find((user: User) => user.email === formData.email)) {
            return setError("email", { message: "User already exists.", type: "unique" })
        }

        // no errors
        if (_.isEmpty(errors)) {
            delete formData.confirmPassword;
            formData.password = await encryptPassword(formData.password);

            const data = await createUser(formData);
            if (!_.isEmpty(data)) {
                router.push("/login");
            };
        }

    }
    return <main className="flex items-center justify-center">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4">
            <div className="flex h-20 w-full items-end rounded-lg bg-cyan-500 p-3 md:h-36">
                <div className="w-32 text-white md:w-36">
                    <MndsLogo />
                </div>
            </div>
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                    <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                        Register to create your account.
                    </h1>
                    <div className="w-full">
                        <div>
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                htmlFor="name"
                            >
                                Name
                            </label>
                            <div className="relative">
                                <input
                                    className={clsx("peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500", { "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.name, "border-gray-200": !errors?.name })}
                                    {...register("name", { required: "name is required." })}
                                    aria-invalid={errors?.name ? "true" : "false"}
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                />
                                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                            {errors?.name?.message && <span className="text-red-500">
                                {errors.name.message}
                            </span>}
                        </div>
                        <div>
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    className={clsx("peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500", { "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.email, "border-gray-200": !errors?.email })}
                                    id="email"
                                    {...register("email",
                                        {
                                            required: "email is required.",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                message: 'Invalid email address',
                                            }
                                        }
                                    )}
                                    aria-invalid={errors?.email ? "true" : "false"}
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                />
                                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                            {errors?.email?.message && <span className="text-red-500">
                                {errors.email.message}
                            </span>}
                        </div>
                        <div className="mt-4">
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    className={clsx("peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500", { "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.password, "border-gray-200": !errors?.password })}
                                    id="password"
                                    type="password"
                                    {...register("password", { required: "password is required" })}
                                    aria-invalid={errors?.password ? "true" : "false"}
                                    name="password"
                                    placeholder="Enter password"
                                    minLength={6}
                                />
                                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                            {errors?.password?.message && <span className="text-red-500">
                                {errors.password.message}
                            </span>}
                        </div>
                        <div className="mt-4">
                            <label
                                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                                htmlFor="confirmPassword"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    className={clsx("peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500", { "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.confirmPassword, "border-gray-200": !errors?.confirmPassword })}
                                    id="confirmPassword"
                                    {...register("confirmPassword",
                                        {
                                            required: "confirm password is required",
                                            validate: (value) => value === getValues("password") || "confirm password should be same as password"
                                        }
                                    )}
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Enter confirm password"
                                    minLength={6}
                                />
                                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                            {errors?.confirmPassword?.message && <span className="text-red-500">
                                {errors.confirmPassword.message}
                            </span>}
                        </div>
                    </div>
                    <Button className="mt-4 w-full">
                        Register <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                    </Button>
                    <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                    </div>
                    <p>Already have an account? <Link className='text-cyan-600' href="/login">Login</Link></p>
                </div>
            </form>
        </div>
    </main>
}