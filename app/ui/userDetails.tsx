"use client"
import { getUserById, getUsers } from '@/app/lib/data';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import moment from 'moment';
import clsx from 'clsx';
import _ from 'lodash';
import { createUser, updateUser } from '@/app/lib/actions';
import Loading from './loading';
import { Hobby, UserDetails } from '../lib/definitions';

type fieldNames = "id" | "name" | "email" | "password" | "gender" | "address" | "phone" | "image_url" | "dob" | "hobbies" | "otherHobbies" | `hobbies.${number}`;

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
        control
    } = useForm<UserDetails>();
    const hobbies: Hobby[] = ["cricket", "singing", "dancing", "travelling", "reading", "vlogging", "other"];
    const router = useRouter();

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

            setUser(data);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        if (!isNewUser) {
            fetchUser();
        }
    }, []);

    // for future reference
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
        if (user && user.id) {
            if (_.isEmpty(errors)) {
                if (!showOtherHobbies || !formData?.otherHobbies?.trim()) {
                    delete formData.otherHobbies;
                }
                updateUser(formData, user.id).then(data => {

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

                if (!_.isEmpty(data)) {
                    // alert("successfully created user!")
                    router.push("/dashboard/users");
                }
            });
        }
    };

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
        {isLoading && <Loading />}
        {(isNewUser || (user && user.id)) && <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">

                <div className='flex gap-[15%]'>
                    {/* User First Name */}
                    <div className="mb-4 w-[45%]">
                        <label
                            htmlFor="firstName"
                            className="mb-2 block text-sm font-medium"
                        >
                            First name
                            <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input
                                    id="firstName"
                                    {...register("firstName", {
                                        required: "First Name is required.",
                                        pattern: {
                                            value: /^[a-zA-Z]+([a-zA-Z ])*$/,
                                            message: 'Please enter alphabates only',
                                        }
                                    })}
                                    aria-invalid={errors?.firstName ? "true" : "false"}
                                    name="firstName"
                                    type="text"
                                    defaultValue={user?.firstName}
                                    placeholder="Enter name"
                                    className={clsx("peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500", { "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.firstName, "border-gray-200": !errors?.firstName })}
                                />
                            </div>
                        </div>
                        {errors?.firstName?.message && <span className="text-red-500">
                            {errors.firstName.message}
                        </span>}
                    </div>

                    {/* User Last Name */}
                    <div className="mb-4 w-[45%]">
                        <label
                            htmlFor="lastName"
                            className="mb-2 block text-sm font-medium"
                        >
                            Last name
                            <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input
                                    id="lastName"
                                    {...register("lastName", {
                                        required: "Last Name is required.",
                                        pattern: {
                                            value: /^[a-zA-Z]+([a-zA-Z ])*$/,
                                            message: 'Please enter alphabates only',
                                        }
                                    })}
                                    aria-invalid={errors?.lastName ? "true" : "false"}
                                    name="lastName"
                                    type="text"
                                    defaultValue={user?.lastName}
                                    placeholder="Enter name"
                                    className={clsx("peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500", { "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.lastName, "border-gray-200": !errors?.lastName })}
                                />
                            </div>
                        </div>
                        {errors?.lastName?.message && <span className="text-red-500">
                            {errors.lastName.message}
                        </span>}
                    </div>

                </div>

                <div className='flex gap-[15%]'>
                    {/* User Email */}
                    <div className="mb-4 w-[45%]">
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

                    {/* User Phone */}
                    <div className="mb-4 w-[45%]">
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
                </div>

                <div className='flex gap-[15%]'>

                    {/* User Gender */}
                    <fieldset className="mb-4 w-[45%]">
                        <legend className="mb-2 block text-sm font-medium">
                            Gender
                            <span className="text-red-500 ml-0.5">*</span>
                        </legend>
                        <div className="w-max rounded-md border border-gray-200 bg-white px-[14px] py-3">
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

                    {/* User DOB */}
                    <div className="mb-4 w-[45%]">
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
                                            value={moment(new Date(getValues("dob") || user?.dob as string)).format('YYYY-MM-DD')}
                                            type="date"
                                            className={clsx("peer w-max block rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500", { "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.dob, "border-gray-200": !errors?.dob })}
                                            onChange={(e) => {
                                                setValue("dob", moment(e.target.value).format("MM-DD-YYYY"));
                                                clearErrors('dob');
                                            }}
                                        />
                                    </>
                                )
                            }}
                        />
                        <div className='flex flex-col'>

                            <span className='text-[12px] text-gray-500'>MM-DD-YYYY</span>
                            {errors?.dob?.message && <span className="text-red-500">
                                {errors.dob.message}
                            </span>}
                        </div>
                    </div>
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
                <fieldset className="mb-4 w-[45%]">
                    <legend className="mb-2 block text-sm font-medium">
                        Hobbies
                    </legend>
                    <div className="w-max rounded-md border border-gray-200 bg-white px-[14px] py-3">
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