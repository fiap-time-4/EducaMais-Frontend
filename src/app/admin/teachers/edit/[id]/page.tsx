"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import UserForm from "@/components/UserForm";
import { userService } from "@/services/userService";
import { authClient } from "@/services/authClient";
import { UpdateUserDTO, SessionUser } from "@/types";
import { Loader2 } from "lucide-react";

export default function EditTeacherPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [initialData, setInitialData] = useState<{ name: string; email: string } | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: session, isPending: isAuthLoading } = authClient.useSession();

    const user = session?.user as SessionUser | undefined;

    // --- CORREÇÃO AQUI ---
    // Antes eu tinha deixado só ADMIN. Agora liberei para TEACHER também.
    useEffect(() => {
        if (!isAuthLoading) {
            // Se não for logado OU (não for Admin E não for Teacher), manda para home.
            if (!user || (user.appRole !== "ADMIN" && user.appRole !== "TEACHER")) {
                router.push("/");
            }
        }
    }, [user, isAuthLoading, router]);

    // Busca de Dados
    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const userData = await userService.getById(id);
                setInitialData({ name: userData.name, email: userData.email });
            } catch (error) {
                console.error(error); // <--- ADICIONE ESTA LINHA (Usa a variável e resolve o erro)
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
            const updateData: UpdateUserDTO = {
                name: data.name,
                email: data.email,
                password: data.password,
                appRole: "TEACHER",
                role: "user"
            };

            await userService.update(id, updateData);

            alert("Professor atualizado com sucesso!");
            router.push("/admin/teachers");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Erro ao atualizar.");
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