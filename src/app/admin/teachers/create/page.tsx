"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/app/components/UserForm";
import { userService } from "@/app/services/userService";
import { authClient } from "@/app/services/authClient";
import { CreateUserDTO, SessionUser } from "@/app/types";
import { Loader2 } from "lucide-react";

export default function CreateTeacherPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: session, isPending: isAuthLoading } = authClient.useSession();

    const user = session?.user as SessionUser | undefined;

    // --- PROTEÇÃO DE ROTA ---
    useEffect(() => {
        if (!isAuthLoading) {
            if (!user || (user.appRole !== "ADMIN" && user.appRole !== "TEACHER")) {
                router.push("/");
            }
        }
    }, [user, isAuthLoading, router]);

    const handleCreate = async (data: any) => {
        setIsSubmitting(true);
        try {
            const teacherData: CreateUserDTO = {
                ...data,
                role: "user",       // Genérico para login
                appRole: "TEACHER", // Específico da regra de negócio
            };

            await userService.create(teacherData);
            alert("Professor cadastrado com sucesso!");
            router.push("/admin/teachers");
        } catch (error: any) {
            alert(error.message || "Erro ao criar professor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isAuthLoading) {
        return <div className="flex justify-center h-screen items-center"><Loader2 className="animate-spin text-orange-500" /></div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Cadastrar Novo Professor</h1>
            <UserForm
                targetRole="TEACHER"
                onSubmit={handleCreate}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}