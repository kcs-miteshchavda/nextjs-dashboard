"use client"
import { getUserById, getUsers } from '@/app/lib/data';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Controller, FieldErrors, SubmitErrorHandler, useForm } from 'react-hook-form';
import moment from 'moment';
import clsx from 'clsx';
import _ from 'lodash';
import { createUser, updateUser } from '@/app/lib/actions';

type Hobby =
    "cricket" | "singing" | "dancing" | "travelling" | "reading" | "vlogging" | "other";

type fieldNames = "id" | "name" | "email" | "password" | "gender" | "address" | "phone" | "image_url" | "dob" | "hobbies" | "otherHobbies" | `hobbies.${number}`;


export type UserDetails = {
    id: string;
    name: string;
    email: string;
    password: string;
    gender: string;
    address: string;
    phone: string;
    image_url: string;
    dob: string;
    hobbies: Hobby[]
    otherHobbies?: string;
};
export default function UserDetails({ id }: { id: string }) {

    const isNewUser: boolean = id === "new";
    const [user, setUser] = useState<UserDetails>();
    const [showOtherHobbies, setShowOtherHobbies] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(!isNewUser);
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
        setError,
        clearErrors,
        control,
        setFocus
    } = useForm<UserDetails>();
    const hobbies: Hobby[] = ["cricket", "singing", "dancing", "travelling", "reading", "vlogging", "other"];
    const router = useRouter();

    useEffect(() => {
        const fetchUser = () => {
            setIsLoading(true);
            getUserById(id).then((data) => {
                if (data && data.id) {
                    setValue("password", data.password);
                    setValue("email", data.email);
                    setValue("dob", data.dob || "");
                    setValue("hobbies", data.hobbies || []);
                    setShowOtherHobbies(!!data.hobbies?.includes("other"));
                }
                console.log("user data of edit page", data);

                setUser(data);
                setIsLoading(false);
            });
        }
        if (!isNewUser) {
            fetchUser();
        }
    }, []);

    // convert date dd-mm-yyyy string to mm-dd-yyyy string
    // javascript Date supports mm-dd-yyyy
    // const changeDateFormat = (date?: string) => {
    //     if (date) {
    //         const spiltDate = date.split("-");
    //         return `${spiltDate[1]}-${spiltDate[0]}-${spiltDate[2]}`
    //     }

    //     return moment(date).format("MM-DD-YYYY");
    // }

    const onInvalidSubmit = async (errors: FieldErrors<UserDetails>) => {
        const firstErrorKey = Object.keys(errors)?.[0] as fieldNames;
        if (firstErrorKey) {
            (document.querySelector(`input[name="${firstErrorKey}"]`) as HTMLInputElement | null)?.focus();
        }
    };

    const onSubmit = async (formData: UserDetails) => {
        console.log("FORMDATA", formData, user)
        if (user && user.id) {
            if (_.isEmpty(errors)) {
                if (!showOtherHobbies || !formData?.otherHobbies?.trim()) {
                    delete formData.otherHobbies;
                }
                updateUser(formData, user.id).then(data => {

                    console.log("update datadatadatadatadatadatadatadatadatadatadata", data);
                    if (!_.isEmpty(data)) {
                        // alert("successfully updated user!")
                        router.push("/dashboard/users");
                    }
                });
            }
        } else {
            if (!showOtherHobbies || !formData?.otherHobbies?.trim()) {
                delete formData.otherHobbies;
            }

            const users = await getUsers();

            // user already exists.
            if (!_.isEmpty(users) && users.find((user: UserDetails) => user.email === formData.email)) {
                return setError("email", { message: "User already exists.", type: "unique" });
            }
            createUser(formData).then(data => {

                console.log("create datadatadatadatadatadatadatadatadatadatadata", data);
                if (!_.isEmpty(data)) {
                    // alert("successfully created user!")
                    router.push("/dashboard/users");
                }
            });
        }
    };
    if (!_.isEmpty(errors)) console.log(errors);

    const handleHobbies = (checked: boolean, value: Hobby) => {
        if (value === "other") {
            setShowOtherHobbies(checked);
        };
        if (user && user.id) {
            let hobbiesArray: Hobby[] = user.hobbies;
            if (checked) {
                hobbiesArray?.push(value);
            } else {
                hobbiesArray = hobbiesArray?.filter(hobby => hobby !== value);
            }
            setUser({ ...user, hobbies: hobbiesArray });
        }
    }

    return <>
        {isLoading &&
            <div className="flex items-center justify-center h-[100vh] w-full">
                <div role="status">
                    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }
        {(isNewUser || (user && user.id)) && <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* User Name */}
                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium"
                    >
                        Name
                        <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="name"
                                {...register("name", { required: "name is required." })}
                                aria-invalid={errors?.name ? "true" : "false"}
                                name="name"
                                type="text"
                                defaultValue={user?.name}
                                placeholder="Enter name"
                                className={clsx("peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500", { "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.name, "border-gray-200": !errors?.name })}
                            />
                        </div>
                    </div>
                    {errors?.name?.message && <span className="text-red-500">
                        {errors.name.message}
                    </span>}
                </div>

                {/* User Email */}
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium"
                    >
                        Email
                        {isNewUser && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: 'Invalid email address format',
                                    }
                                })}
                                id="email"
                                name="email"
                                type="text"
                                value={user?.email}
                                disabled={!isNewUser}
                                placeholder="Enter email address"
                                className={clsx("peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2",
                                    {
                                        "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.email,
                                        "border-gray-200": !errors?.email,
                                        "text-gray-500 placeholder:text-gray-500 hover:cursor-not-allowed": !isNewUser
                                    })}
                            />
                        </div>
                        {!isNewUser && <span className='text-[12px] text-gray-500'>
                            Email address cannot be changed.
                        </span>}
                    </div>
                    {errors?.email?.message && <span className="text-red-500">
                        {errors.email.message}
                    </span>}
                </div>

                {/* User DOB */}
                <div className="mb-4 flex flex-col">
                    <label
                        htmlFor="dob"
                        className="mb-2 block w-max text-sm font-medium"
                    >
                        Date of birth
                        <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <Controller
                        name="dob" // Specify the field name
                        control={control}
                        // defaultValue={moment(new Date(user.dob)).format('YYYY-MM-DD')} // Set the initial value as needed
                        rules={
                            {
                                required: "Date of birth is required",
                                validate: (value) => moment(value, "MM-DD-YYYY").isSameOrBefore(moment()) || "Date of birth should not be greater than today's date"
                            }
                        } // Add validation rules here
                        render={({ field: { onBlur, onChange, value } }) => {
                            return (
                                <>
                                    <input
                                        id="dob"
                                        name="dob"
                                        // {...register("dob")}
                                        value={moment(new Date(getValues("dob") || user?.dob as string)).format('YYYY-MM-DD')}
                                        type="date"
                                        className={clsx("peer w-max block rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500", { "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.dob, "border-gray-200": !errors?.dob })}
                                        // placeholder={"mm/dd/yyyy"}
                                        onChange={(e) => {
                                            setValue("dob", moment(e.target.value).format("MM-DD-YYYY"));
                                            clearErrors('dob');
                                        }}
                                    />
                                    <span className='text-[12px] text-gray-500'>MM-DD-YYYY</span>
                                </>
                            )
                        }}
                    />
                    {errors?.dob?.message && <span className="text-red-500">
                        {errors.dob.message}
                    </span>}
                </div>

                {/* User Gender */}
                <fieldset>
                    <legend className="mb-2 block text-sm font-medium">
                        Gender
                        <span className="text-red-500 ml-0.5">*</span>
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <input
                                    {...register("gender", { required: "gender is required" })}
                                    id="male"
                                    name="gender"
                                    type="radio"
                                    value="male"
                                    defaultChecked={
                                        user?.gender === 'male' || !user?.gender
                                    }
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                    aria-describedby="status-error"
                                />
                                <label
                                    htmlFor="male"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                                >
                                    Male
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    {...register("gender", { required: "gender is required" })}
                                    id="female"
                                    name="gender"
                                    type="radio"
                                    value="female"
                                    defaultChecked={user?.gender === 'female'}
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                />
                                <label
                                    htmlFor="female"
                                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                                >
                                    Female
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* User Phone */}
                <div className="mt-4 mb-4">
                    <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-medium"
                    >
                        Mobile number
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="phone"
                                {...register("phone", {
                                    pattern: {
                                        value: /^[1-9]{1}[0-9]{9}$/,
                                        message: 'mobile number should be of 10 digits',
                                    }
                                })}
                                aria-invalid={errors?.phone ? "true" : "false"}
                                name="phone"
                                type="text"
                                defaultValue={user?.phone}
                                placeholder="Enter mobile number"
                                className={clsx("peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500", { "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.phone, "border-gray-200": !errors?.phone })}
                            />
                        </div>
                    </div>
                    {errors?.phone?.message && <span className="text-red-500">
                        {errors.phone.message}
                    </span>}
                </div>

                {/* User Address */}
                <div className="mt-4 mb-4">
                    <label
                        htmlFor="address"
                        className="mb-2 block text-sm font-medium"
                    >
                        Address
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <textarea
                                {...register("address", { maxLength: 1000 })}
                                name="address"
                                defaultValue={user?.address}
                                placeholder="Enter address"
                                className={clsx("peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500", { "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.address, "border-gray-200": !errors?.address })}
                                rows={3}
                            />
                        </div>
                    </div>
                    {errors?.address?.message && <span className="text-red-500">
                        {errors.address.message}
                    </span>}
                </div>

                {/* User Hobbies */}
                <fieldset>
                    <legend className="mb-2 block text-sm font-medium">
                        Hobbies
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="flex gap-4 flex flex-wrap justify-between md:justify-normal">
                            {hobbies.map((hobby: Hobby) => <div key={hobby} className="flex items-center">
                                <input
                                    {...register("hobbies")}
                                    name="hobbies"
                                    type="checkbox"
                                    value={hobby}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleHobbies(e.target.checked, e.target.value as Hobby)}
                                    checked={
                                        user?.hobbies?.includes(hobby)
                                    }
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                    aria-describedby="status-error"
                                />
                                <label
                                    htmlFor={hobby}
                                    className={clsx("ml-2 capitalize flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium", { "bg-green-500 text-white": hobby === "other" && showOtherHobbies, "bg-gray-100 text-gray-600": hobby !== "other" || (hobby === "other" && !showOtherHobbies) })}
                                >
                                    {hobby}
                                </label>
                            </div>)}
                        </div>
                        {showOtherHobbies && <textarea
                            {...register("otherHobbies", { maxLength: 1000 })}
                            name="otherHobbies"
                            value={user?.otherHobbies}
                            placeholder="Enter other hobbies..."
                            className={clsx("peer mt-4 block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500", { "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.otherHobbies, "border-gray-200": !errors?.otherHobbies })}
                            rows={3}
                        />}
                    </div>
                </fieldset>

            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/users"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <button
                    className={"flex h-10 items-center rounded-lg bg-cyan-500 px-4 text-sm font-medium text-white transition-colors hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-cyan-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"}
                >
                    {isNewUser ? "Create" : "Update"}
                </button>
            </div>
        </form>}

        {!isLoading && !isNewUser && (!user || !user.id) && <div className="rounded-md bg-gray-50 p-4 md:p-6">
            <p>No User Found of id: {id}</p>
        </div>}
    </>
}