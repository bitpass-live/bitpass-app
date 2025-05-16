import { Loader } from "lucide-react";

export function LoaderView() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex items-center justify-center py-6">
                <Loader />
            </main>
        </div>
    );
}
