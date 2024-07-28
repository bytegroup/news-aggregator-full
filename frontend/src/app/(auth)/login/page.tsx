import {LoginForm} from "@/components/ui/LoginForm";
import {Suspense} from "react";

export default function LoginPage(){
    return (
        <div>
            <Suspense>
                <LoginForm></LoginForm>
            </Suspense>
        </div>
    );
}