"use client"
import { getRoleById, getRoles, } from '@/app/lib/data';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { FieldErrors, useForm } from 'react-hook-form';
import clsx from 'clsx';
import _ from 'lodash';
import { createRole, updateRole } from '@/app/lib/actions';
import Loading from './loading';
import { RoleDetails } from '../lib/definitions';

type fieldNames = "id" | "roleName" | "active";

export default function RoleDetails({ id }: { id: string }) {

    const isNewRole: boolean = id === "new";
    const [role, setRole] = useState<RoleDetails>();
    const [isLoading, setIsLoading] = useState<boolean>(!isNewRole);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
    } = useForm<RoleDetails>();
    const router = useRouter();

    const fetchRole = () => {
        setIsLoading(true);
        getRoleById(id).then((data) => {

            if (data && data.id) {
                setValue("active", data.active);
            }
            setRole(data);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        if (!isNewRole) {
            fetchRole();
        }
    }, []);

    const onInvalidSubmit = async (errors: FieldErrors<RoleDetails>) => {
        const firstErrorKey = Object.keys(errors)?.[0] as fieldNames;
        if (firstErrorKey) {
            (document.querySelector(`input[name="${firstErrorKey}"]`) as HTMLInputElement | null)?.focus();
        }
    };

    const onSubmit = async (formData: RoleDetails) => {
        const roles = await getRoles();
        if (!isNewRole) {
            if (_.isEmpty(errors)) {

                // role already exists.
                if (!_.isEmpty(roles)
                    && roles.find((role: RoleDetails) => role.roleName === formData.roleName)
                    && role?.roleName !== formData.roleName) {
                    return setError("roleName", { message: "role already exists.", type: "unique" });
                }

                updateRole(formData, role?.id as string).then(data => {

                    if (!_.isEmpty(data)) {
                        // alert("successfully updated role!")
                        router.push("/dashboard/roles");
                    }
                });
            }
        } else {

            // role already exists.
            if (!_.isEmpty(roles) && roles.find((role: RoleDetails) => role.roleName === formData.roleName)) {
                return setError("roleName", { message: "role already exists.", type: "unique" });
            }
            createRole(formData).then(data => {

                if (!_.isEmpty(data)) {
                    // alert("successfully created role!")
                    router.push("/dashboard/roles");
                }
            });
        }
    };

    const handleActive = (checked: boolean) => {
        if (role && role.id) {
            setRole({ ...role, active: checked });
        }
    }

    return <>
        {isLoading && <Loading />}
        {(isNewRole || (role && role.id)) && <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">

                {/* Role Name */}
                <div className="mb-4 w-[50%]">
                    <label
                        htmlFor="roleName"
                        className="mb-2 block text-sm font-medium"
                    >
                        Role name
                        <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="roleName"
                                {...register("roleName", {
                                    required: "Role Name is required.",
                                    pattern: {
                                        value: /^[a-zA-Z]+([a-zA-Z ])*$/,
                                        message: 'Please enter alphabates only',
                                    }
                                })}
                                aria-invalid={errors?.roleName ? "true" : "false"}
                                name="roleName"
                                type="text"
                                defaultValue={role?.roleName}
                                placeholder="Enter role name"
                                className={clsx("peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500", { "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.roleName, "border-gray-200": !errors?.roleName })}
                            />
                        </div>
                    </div>
                    {errors?.roleName?.message && <span className="text-red-500">
                        {errors.roleName.message}
                    </span>}
                </div>

                {/* Role Active */}
                <fieldset className="mb-4 flex gap-[15px] items-center">
                    {/* <legend className="mb-2 block text-sm font-medium">
                            Active
                        </legend> */}
                    <label
                        htmlFor="active"
                        className="mb-2 block text-sm font-medium"
                    // className="ml-2 capitalize flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600"
                    >
                        Active :
                    </label>
                    <div className="w-max rounded-md border border-gray-200 mb-2">
                        <div className="flex gap-4 flex flex-wrap justify-between md:justify-normal">
                            <input
                                {...register("active")}
                                name="active"
                                type="checkbox"
                                value="active"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleActive(e.target.checked)}
                                checked={role?.active}
                                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                aria-describedby="status-error"
                            />
                        </div>
                    </div>
                </fieldset>


            </div >
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/roles"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <button
                    className={"flex h-10 items-center rounded-lg bg-cyan-500 px-4 text-sm font-medium text-white transition-colors hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-cyan-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"}
                >
                    {isNewRole ? "Create" : "Update"}
                </button>
            </div>
        </form >}

        {
            !isLoading && !isNewRole && (!role || !role.id) && <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <p>No Role Found of id: {id}</p>
            </div>
        }
    </>
}