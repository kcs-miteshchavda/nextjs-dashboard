"use client"
import { TrashIcon } from "@heroicons/react/24/outline";
// import { deleteUser } from "../lib/actions";

type DeleteButtonProps = {
    handleDelete: (id: string) => Promise<void>
    id: string
    moduleName: string
};

const deleteRecord = async (id: string, moduleName: string, handleDelete: (id: string) => Promise<void>) => {
    if (typeof window !== "undefined") {
        const confirmation = window.confirm(`Are you sure you want to delete this ${moduleName}?`);
        if (confirmation) {
            await handleDelete(id);
            alert(`${moduleName} deleted successfully!`);
        }
    }
}

export default function DeleteButton({ id, moduleName, handleDelete }: DeleteButtonProps) {
    return <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon onClick={() => deleteRecord(id, moduleName, handleDelete)} className="w-5" />
    </button>
}