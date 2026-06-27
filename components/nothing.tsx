"use server";

export default async function Nothing() {

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (
        <div className="flex items-center justify-center h-full">

        </div>
    );
}