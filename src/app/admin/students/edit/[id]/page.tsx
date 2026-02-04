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

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useRequireRole(["ADMIN", "TEACHER"]);

  const [initialData, setInitialData] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isPending: isAuthLoading } = authClient.useSession();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const userData = await userService.getById(id);
        setInitialData({ name: userData.name, email: userData.email });
      } catch (error) {
        console.error("Erro ao buscar aluno:", error);
        alert("Erro ao buscar dados do aluno.");
        router.push("/admin/students");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (id) fetchStudent();
  }, [id, router]);

  const handleUpdate = async (data: Partial<UpdateUserDTO>) => {
    setIsSubmitting(true);
    try {
      const updateData: UpdateUserDTO = {
        name: data.name,
        email: data.email,
        password: data.password,
        appRole: "STUDENT",
        role: "user",
      };

      await userService.update(id, updateData);

      alert("Aluno atualizado com sucesso!");
      router.push("/admin/students");
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Aluno</h1>
      <UserForm
        targetRole="STUDENT"
        initialData={initialData}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        isEditing={true}
      />
    </div>
  );
}
