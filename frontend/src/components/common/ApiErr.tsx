export interface ApiErrProps {
    message: string | undefined;
    status: number | undefined;
}

export function ApiErr( { error }: { readonly error: ApiErrProps }) {
    if (!error?.message) return null;
    return <div className="text-pink-500 text-md italic py-2">{error.message}</div>;
}