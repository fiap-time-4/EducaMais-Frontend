"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/components/UserForm";
import { userService } from "@/services/userService";
import { authClient } from "@/services/authClient";
import { CreateUserDTO } from "@/types";
import { Loader2 } from "lucide-react";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function CreateTeacherPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. SEGURANÇA: O Hook assume o controle.
    // Redireciona automaticamente se não for ADMIN ou TEACHER
    useRequireRole(["ADMIN", "TEACHER"]);

    // Precisamos do isPending apenas para o loading visual inicial
    const { isPending: isAuthLoading } = authClient.useSession();

    // 2. TIPAGEM MELHORADA: Trocamos 'any' por 'Partial<CreateUserDTO>'
    const handleCreate = async (data: Partial<CreateUserDTO>) => {
        setIsSubmitting(true);
        try {
            // Garantimos que os dados obrigatórios existam antes de enviar
            const teacherData: CreateUserDTO = {
                name: data.name || "",
                email: data.email || "",
                password: data.password || "",
                role: "user",       
                appRole: "TEACHER", 
            };

            await userService.create(teacherData);
            alert("Professor cadastrado com sucesso!");
            router.push("/admin/teachers");
        } catch (error: unknown) { // <--- 'unknown' para evitar o lint de 'any'
            console.error(error);
            let message = "Erro ao criar professor.";

            // 3. TRATAMENTO DE ERRO SEGURO (Type Narrowing)
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            } else if (error instanceof Error) {
                message = error.message;
            }

            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="flex justify-center h-screen items-center">
                <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
        );
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