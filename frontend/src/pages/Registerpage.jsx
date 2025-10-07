import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router";
import { registerUser } from "@/services/authService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await registerUser(form);

    if (data.message?.includes("verify")) {
      toast.success("Đăng ký thành công! Vui lòng kiểm tra email xác minh.");
      navigate("/login");
    } else {
      toast.error(data.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(120deg, #C8E6C9 0%, #DCEDC8 20%, #F1F8E9 40%, #FFFDE7 60%, #FFF9C4 80%, #F0F4C3 100%)`,
        }}
      />
      <Header />

      <Card className="flex flex-col h-full w-full mx-auto max-w-sm relative z-10 shadow-lg">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Register to start using our services</CardDescription>
          <CardAction>
            <Button variant="link" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

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
                <Label htmlFor="password">Password</Label>
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
                Register
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
