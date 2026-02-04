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

export default function CreateStudentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useRequireRole(["ADMIN", "TEACHER"]);

  const { isPending: isAuthLoading } = authClient.useSession();

  const handleCreate = async (data: Partial<CreateUserDTO>) => {
    setIsSubmitting(true);
    try {
      const studentData: CreateUserDTO = {
        name: data.name || "",
        email: data.email || "",
        password: data.password || "",
        role: "user",
        appRole: "STUDENT",
      };

      await userService.create(studentData);
      alert("Aluno cadastrado com sucesso!");
      router.push("/admin/students");
    } catch (error: unknown) {
      console.error(error);
      let message = "Erro ao criar aluno.";

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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Cadastrar Novo Aluno
      </h1>
      <UserForm
        targetRole="STUDENT"
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
