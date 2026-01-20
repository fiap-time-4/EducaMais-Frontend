"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import UserForm from "@/app/components/UserForm";
import { userService } from "@/app/services/userService";
import { authClient } from "@/app/services/authClient";
import { UpdateUserDTO, SessionUser } from "@/app/types";
import { Loader2 } from "lucide-react";

export default function EditTeacherPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [initialData, setInitialData] = useState<{ name: string; email: string } | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: session, isPending: isAuthLoading } = authClient.useSession();
    
    // O erro de 'Property appRole does not exist' vai sumir se você fez o Passo 1
    const user = session?.user as SessionUser | undefined;

    useEffect(() => {
        if (!isAuthLoading) {
            if (!user || (user.appRole !== "ADMIN" && user.appRole !== "TEACHER")) {
                router.push("/");
            }
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const userData = await userService.getById(id);
                setInitialData({ name: userData.name, email: userData.email });
            } catch (error) {
                alert("Erro ao buscar dados do professor.");
                router.push("/admin/teachers");
            } finally {
                setIsLoadingData(false);
            }
        };

        if (id) fetchTeacher();
    }, [id, router]);

    const handleUpdate = async (data: any) => {
        setIsSubmitting(true);
        try {
            const updateData: UpdateUserDTO = {
                ...data,
                appRole: "TEACHER", 
            };

            await userService.update(id, updateData);

            alert("Professor atualizado com sucesso!");
            router.push("/admin/teachers");
        } catch (error: any) {
            alert(error.message || "Erro ao atualizar.");
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

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Professor</h1>
            {initialData && (
                <UserForm
                    targetRole="TEACHER"
                    initialData={initialData}
                    onSubmit={handleUpdate}
                    isSubmitting={isSubmitting}
                    isEditing={true}
                />
            )}
        </div>
    );
}