import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const VerifyEmailPage = () => {
    const { token } = useParams(); // Lấy token từ URL
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading");
    const fired = React.useRef(false);

    useEffect(() => {
        if (fired.current) return;
        fired.current = true;
        const verifyEmail = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/users/verify/${token}`);
                const data = await res.json();

                if (res.ok) {
                    setStatus("success");
                    toast.success("Xác minh email thành công!");
                } else {
                    setStatus((prev) => (prev === "success" ? "success" : "error"));
                    if (data?.message) toast.error(data.message);
                }
            } catch {
                setStatus((prev) => (prev === "success" ? "success" : "error"));
            }
        };

        verifyEmail();
    }, [token]);

    const renderContent = () => {
        if (status === "loading") {
            return (
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-gray-700">Đang xác minh tài khoản của bạn...</p>
                </div>
            );
        }

        if (status === "success") {
            return (
                <div className="flex flex-col items-center gap-4">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                    <h2 className="text-lg font-semibold">Email của bạn đã được xác minh!</h2>
                    <Button onClick={() => navigate("/login")} className="mt-3">
                        Đăng nhập ngay
                    </Button>
                </div>
            );
        }

        if (status === "error") {
            return (
                <div className="flex flex-col items-center gap-4">
                    <XCircle className="w-12 h-12 text-red-600" />
                    <h2 className="text-lg font-semibold text-red-700">
                        Token không hợp lệ hoặc đã hết hạn!
                    </h2>
                    <Button onClick={() => navigate("/register")} variant="outline" className="mt-3">
                        Đăng ký lại
                    </Button>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-6">Xác minh tài khoản</h1>
                {renderContent()}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
