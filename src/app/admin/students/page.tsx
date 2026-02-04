"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { userService } from "@/services/userService";
import { authClient } from "@/services/authClient";
import { User } from "@/types";
import { Loader2, Plus } from "lucide-react";
import { PrimaryButton } from "@/components/buttons/StyledButtons";
import Pagination from "@/components/Pagination";
import UserCard from "@/components/UserCard";
import { useRequireRole } from "@/hooks/useRequireRole";

const LIMIT = 10;

export default function StudentsListPage() {
  useRequireRole(["ADMIN", "TEACHER"]);

  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { isPending: isAuthLoading } = authClient.useSession();

  const fetchStudents = useCallback(async (pageNumber: number) => {
    try {
      setLoading(true);
      const result = await userService.getAllByRole(
        "STUDENT",
        pageNumber,
        LIMIT
      );

      setStudents(result.data);

      if (result.pagination) {
        setTotalPages(result.pagination.pages);
      }
    } catch (err: unknown) {
      console.error(err);
      setError("Erro ao carregar alunos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchStudents(page);
    }
  }, [isAuthLoading, page, fetchStudents]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este aluno?")) return;
    try {
      await userService.delete(id);
      setStudents((prev) => prev.filter((t) => t.id !== id));
      alert("Aluno removido com sucesso!");
    } catch (err: unknown) {
      console.error(err);
      alert("Erro ao excluir aluno.");
    }
  };

  if (isAuthLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Alunos</h1>
          <p className="text-gray-600 mt-1">Gerencie os alunos cadastrados.</p>
        </div>

        <Link href="/admin/students/create">
          <PrimaryButton>
            <Plus size={18} />
            <span className="hidden sm:inline">Novo Aluno</span>
          </PrimaryButton>
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded border border-red-200">
          {error}
        </div>
      )}

      {!error && students.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">Nenhum aluno cadastrado ainda.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {students.map((student) => (
              <UserCard
                key={student.id}
                user={student}
                type={student.appRole}
                editLink={`/admin/students/edit/${student.id}`}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onNext={handleNextPage}
            onPrevious={handlePrevPage}
          />
        </>
      )}
    </div>
  );
}
