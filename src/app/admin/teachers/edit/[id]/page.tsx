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

    useRequireRole(["ADMIN", "TEACHER"]);

    const [initialData, setInitialData] = useState<{ 
        name: string; 
        email: string; 
        appRole: "ADMIN" | "TEACHER" | "STUDENT" 
    } | null>(null);

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { isPending: isAuthLoading } = authClient.useSession();

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const userData = await userService.getById(id);
                
                setInitialData({ 
                    name: userData.name, 
                    email: userData.email,
                    appRole: userData.appRole
                });
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
                alert("Erro ao buscar dados.");
                router.push("/admin/teachers");
            } finally {
                setIsLoadingData(false);
            }
        };

        if (id) fetchTeacher();
    }, [id, router]);

    const handleUpdate = async (data: Partial<UpdateUserDTO>) => {
        setIsSubmitting(true);
        try {
            const currentRole = initialData?.appRole || "TEACHER";

            const updateData: UpdateUserDTO = {
                name: data.name,
                email: data.email,
                appRole: currentRole,
                role: "user"
            };

            if (data.password && data.password.trim() !== "") {
                updateData.password = data.password;
            }

            await userService.update(id, updateData);

            alert("Dados atualizados com sucesso!");
            router.push("/admin/teachers");
        } catch (error: unknown) {
            console.error(error);
            let message = "Erro ao atualizar.";

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
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Editar {initialData.appRole === 'ADMIN' ? 'Administrador' : 'Professor'}
            </h1>
            
            <UserForm
                targetRole={initialData.appRole} 
                initialData={initialData}
                onSubmit={handleUpdate}
                isSubmitting={isSubmitting}
                isEditing={true}
            />
        </div>
    );
}