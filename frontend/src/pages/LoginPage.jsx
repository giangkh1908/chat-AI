import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Header from '@/components/Header'
import { toast } from "sonner";
import { useNavigate, Link } from "react-router";
import { loginUser } from "@/services/authService";


const LoginPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await loginUser(form);

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Đăng nhập thành công!");
            navigate("/"); // chuyển về trang chủ
        } else {
            toast.error(data.message || "Đăng nhập thất bại!");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative">
            {/* Minty Cloud Drift Gradient */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: `linear-gradient(120deg, #C8E6C9 0%, #DCEDC8 20%, #F1F8E9 40%, #FFFDE7 60%, #FFF9C4 80%, #F0F4C3 100%)`,
                }}
            />
            {/* Your Content/Components */}
            <Header />
            <Card className="flex flex-col h-full w-full mx-auto max-w-sm  relative">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                    <CardAction>
                        <Button variant="link" asChild>
                            <Link to="/register">Sign Up</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <CardFooter className="flex-col gap-2 mt-6">
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                            <Button variant="outline" className="w-full">
                                Login with Facebook
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>

            </Card>
        </div>
    )
}

export default LoginPage
