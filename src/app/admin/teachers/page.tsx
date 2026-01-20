"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userService } from "@/app/services/userService";
import { authClient } from "@/app/services/authClient";
import { User, SessionUser } from "@/app/types";
import { Loader2, Trash2, Edit, Plus, Mail, User as UserIcon } from "lucide-react";
import { PrimaryButton } from "@/app/components/buttons/StyledButtons"; 
import Pagination from "@/app/components/Pagination";

export default function TeachersListPage() {
    const router = useRouter();
    // 1. Constante LIMIT usada corretamente agora
    const LIMIT = 10; 
    
    const [teachers, setTeachers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { data: session, isPending: isAuthLoading } = authClient.useSession();
    const user = session?.user as SessionUser | undefined;

    useEffect(() => {
        if (!isAuthLoading && user?.role === "STUDENT") {
            router.push("/");
        }
    }, [user, isAuthLoading, router]);

    // 2. Envolvido em useCallback para evitar loops ou recriações desnecessárias
    const fetchTeachers = useCallback(async (pageNumber: number) => {
        try {
            setLoading(true);
            
            // CORREÇÃO: Usando a variável LIMIT aqui
            const result = await userService.getAllByRole("TEACHER", pageNumber, LIMIT);
            
            setTeachers(result.data);
            
            if (result.pagination) {
                setTotalPages(result.pagination.pages);
            }
        } catch (err) {
            setError("Erro ao carregar professores.");
        } finally {
            setLoading(false);
        }
    }, [LIMIT]); // LIMIT é a única dependência externa fixa

    // 3. Effect agora depende do fetchTeachers (que é estável graças ao useCallback)
    useEffect(() => {
        if (!isAuthLoading && user && user.role !== "STUDENT") {
            fetchTeachers(page);
        }
    }, [isAuthLoading, user, page, fetchTeachers]);

    const handlePrevPage = () => {
        if (page > 1) setPage((p) => p - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage((p) => p + 1);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja remover este professor?")) return;
        try {
            await userService.delete(id);
            setTeachers((prev) => prev.filter((t) => t.id !== id));
            alert("Professor removido com sucesso!");
        } catch (err) {
            alert("Erro ao excluir professor.");
        }
    };

    // Loading State
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
                    <h1 className="text-3xl font-bold text-gray-800">Professores</h1>
                    <p className="text-gray-600 mt-1">Gerencie o corpo docente da escola.</p>
                </div>

                <Link href="/admin/teachers/create">
                    <PrimaryButton>
                        <Plus size={18} />
                        <span className="hidden sm:inline">Novo Professor</span>
                    </PrimaryButton>
                </Link>
            </div>

            {error && (
                <div className="p-4 mb-4 bg-red-100 text-red-700 rounded border border-red-200">
                    {error}
                </div>
            )}

            {teachers.length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">Nenhum professor cadastrado ainda.</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4">
                        {teachers.map((teacher) => (
                            <div
                                key={teacher.id}
                                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                            >
                                <div className="flex-1 w-full">
                                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <UserIcon size={20} className="text-gray-400" />
                                        {teacher.name}
                                    </h2>

                                    <div className="flex items-center gap-2 mt-2 text-gray-600">
                                        <Mail size={16} />
                                        <span>{teacher.email}</span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4">
                                        <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded uppercase tracking-wider border border-orange-100">
                                            Professor
                                        </span>
                                        {/* Proteção caso o ID seja menor que 8 caracteres */}
                                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-2">
                                            ID: {teacher.id?.slice(0, 8)}...
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                                    <Link
                                        href={`/admin/teachers/edit/${teacher.id}`}
                                        className="flex-1 md:flex-none text-center text-indigo-600 hover:bg-indigo-50 font-medium text-sm border border-indigo-200 px-4 py-2 rounded transition-all"
                                    >
                                        Editar
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(teacher.id)}
                                        className="flex-1 md:flex-none text-center text-red-600 hover:bg-red-50 font-medium text-sm border border-red-200 px-4 py-2 rounded transition-all"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
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