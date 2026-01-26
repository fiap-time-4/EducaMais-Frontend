"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import UserForm from "@/components/UserForm";
import { userService } from "@/services/userService";
import { authClient } from "@/services/authClient";
import { UpdateUserDTO } from "@/types";
import { Loader2 } from "lucide-react";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function EditTeacherPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    // 1. SEGURANÇA: O Hook assume o controle.
    // Só ADMIN e TEACHER podem acessar essa página.
    useRequireRole(["ADMIN", "TEACHER"]);

    const [initialData, setInitialData] = useState<{ name: string; email: string } | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Precisamos do isPending apenas para manter o loader rodando enquanto o hook verifica
    const { isPending: isAuthLoading } = authClient.useSession();

    // Busca de Dados do Professor a ser editado
    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const userData = await userService.getById(id);
                setInitialData({ name: userData.name, email: userData.email });
            } catch (error) {
                console.error("Erro ao buscar professor:", error);
                alert("Erro ao buscar dados do professor.");
                router.push("/admin/teachers");
            } finally {
                setIsLoadingData(false);
            }
        };

        if (id) fetchTeacher();
    }, [id, router]);

    // Atualização
    const handleUpdate = async (data: Partial<UpdateUserDTO>) => {
        setIsSubmitting(true);
        try {
            // Montamos o objeto garantindo que o cargo continue sendo TEACHER
            const updateData: UpdateUserDTO = {
                name: data.name,
                email: data.email,
                password: data.password, // Se vier vazio, o backend ignora
                appRole: "TEACHER",
                role: "user"
            };

            await userService.update(id, updateData);

            alert("Professor atualizado com sucesso!");
            router.push("/admin/teachers");
        } catch (error: unknown) {
            console.error(error);

            let message = "Erro ao atualizar.";

            // JEITO CERTO: Perguntamos pro Axios: "Isso é um erro seu?"
            if (axios.isAxiosError(error)) {
                // O TypeScript agora SABE que 'error' tem .response e .data
                message = error.response?.data?.message || message;
            } else if (error instanceof Error) {
                // Se for um erro genérico do JS (ex: erro de sintaxe)
                message = error.message;
            }

            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isAuthLoading || isLoadingData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
        );
    }

    if (!initialData) return null;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Professor</h1>
            <UserForm
                targetRole="TEACHER"
                initialData={initialData}
                onSubmit={handleUpdate}
                isSubmitting={isSubmitting}
                isEditing={true}
            />
        </div>
    );
}