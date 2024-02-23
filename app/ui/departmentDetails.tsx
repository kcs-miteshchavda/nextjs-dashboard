"use client"
import { getDepartmentById, getDepartments, } from '@/app/lib/data';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { FieldErrors, useForm } from 'react-hook-form';
import clsx from 'clsx';
import _ from 'lodash';
import { createDepartment, updateDepartment } from '@/app/lib/actions';
import Loading from './loading';
import { DepartmentDetails } from '../lib/definitions';

type fieldNames = "id" | "departmentName" | "active";

export default function DepartmentDetails({ id }: { id: string }) {

    const isNewDepartment: boolean = id === "new";
    const [department, setDepartment] = useState<DepartmentDetails>();
    const [isLoading, setIsLoading] = useState<boolean>(!isNewDepartment);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError
    } = useForm<DepartmentDetails>();
    const router = useRouter();

    const fetchDepartment = () => {
        setIsLoading(true);
        getDepartmentById(id).then((data) => {

            if (data && data.id) {
                setValue("active", data.active);
            }
            setDepartment(data);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        if (!isNewDepartment) {
            fetchDepartment();
        }
    }, []);

    const onInvalidSubmit = async (errors: FieldErrors<DepartmentDetails>) => {
        const firstErrorKey = Object.keys(errors)?.[0] as fieldNames;
        if (firstErrorKey) {
            (document.querySelector(`input[name="${firstErrorKey}"]`) as HTMLInputElement | null)?.focus();
        }
    };

    const onSubmit = async (formData: DepartmentDetails) => {
        const departments = await getDepartments();
        if (!isNewDepartment) {
            if (_.isEmpty(errors)) {

                // department already exists.
                if (!_.isEmpty(departments)
                    && departments.find((department: DepartmentDetails) => department.departmentName === formData.departmentName)
                    && department?.departmentName !== formData.departmentName) {
                    return setError("departmentName", { message: "department already exists.", type: "unique" });
                }

                updateDepartment(formData, department?.id as string).then(data => {

                    if (!_.isEmpty(data)) {
                        // alert("successfully updated department!")
                        router.push("/dashboard/departments");
                    }
                });
            }
        } else {

            // department already exists.
            if (!_.isEmpty(departments) && departments.find((department: DepartmentDetails) => department.departmentName === formData.departmentName)) {
                return setError("departmentName", { message: "department already exists.", type: "unique" });
            }
            createDepartment(formData).then(data => {

                if (!_.isEmpty(data)) {
                    // alert("successfully created department!")
                    router.push("/dashboard/departments");
                }
            });
        }
    };

    const handleActive = (checked: boolean) => {
        if (department && department.id) {
            setDepartment({ ...department, active: checked });
        }
    }

    return <>
        {isLoading && <Loading />}
        {(isNewDepartment || (department && department.id)) && <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">

                {/* Department Name */}
                <div className="mb-4 w-[50%]">
                    <label
                        htmlFor="departmentName"
                        className="mb-2 block text-sm font-medium"
                    >
                        Department name
                        <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="departmentName"
                                {...register("departmentName", {
                                    required: "Department Name is required.",
                                    pattern: {
                                        value: /^[a-zA-Z]+([a-zA-Z ])*$/,
                                        message: 'Please enter alphabates only',
                                    }
                                })}
                                aria-invalid={errors?.departmentName ? "true" : "false"}
                                name="departmentName"
                                type="text"
                                defaultValue={department?.departmentName}
                                placeholder="Enter department name"
                                className={clsx("peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500", { "border-red-400 focus:border-red-500 focus:ring-red-500": errors?.departmentName, "border-gray-200": !errors?.departmentName })}
                            />
                        </div>
                    </div>
                    {errors?.departmentName?.message && <span className="text-red-500">
                        {errors.departmentName.message}
                    </span>}
                </div>

                {/* Department Active */}
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
                                checked={department?.active}
                                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                aria-describedby="status-error"
                            />
                        </div>
                    </div>
                </fieldset>


            </div >
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/departments"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <button
                    className={"flex h-10 items-center rounded-lg bg-cyan-500 px-4 text-sm font-medium text-white transition-colors hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-cyan-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"}
                >
                    {isNewDepartment ? "Create" : "Update"}
                </button>
            </div>
        </form >}

        {
            !isLoading && !isNewDepartment && (!department || !department.id) && <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <p>No Department Found of id: {id}</p>
            </div>
        }
    </>
}