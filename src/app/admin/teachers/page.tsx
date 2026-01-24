"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userService } from "@/app/services/userService";
import { authClient } from "@/app/services/authClient";
import { User, SessionUser } from "@/app/types";
import { Loader2, Plus } from "lucide-react";
import { PrimaryButton } from "@/app/components/buttons/StyledButtons";
import Pagination from "@/app/components/Pagination";
import UserCard from "@/app/components/UserCard";

const LIMIT = 10;

export default function TeachersListPage() {
    const router = useRouter();

    const [teachers, setTeachers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { data: session, isPending: isAuthLoading } = authClient.useSession();
    
    const user = session?.user as SessionUser | undefined;


    useEffect(() => {
        if (!isAuthLoading && user) {
            const isAuthorized = user.appRole === "ADMIN" || user.appRole === "TEACHER";
            
            if (!isAuthorized) {
                router.push("/");
            }
        }
    }, [user, isAuthLoading, router]);

    const fetchTeachers = useCallback(async (pageNumber: number) => {
        try {
            setLoading(true);
            const result = await userService.getAllByRole("TEACHER", pageNumber, LIMIT);

            setTeachers(result.data);

            if (result.pagination) {
                setTotalPages(result.pagination.pages);
            }
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar professores.");
        } finally {
            setLoading(false);
        }
    }, []);

    // --- 2. PROTEÇÃO DE CARREGAMENTO ---
    useEffect(() => {
        if (!isAuthLoading && user) {
            const isAuthorized = user.appRole === "ADMIN" || user.appRole === "TEACHER";
            
            if (isAuthorized) {
                fetchTeachers(page);
            }
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
            console.error(err);
            alert("Erro ao excluir professor.");
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

            {!error && teachers.length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">Nenhum professor cadastrado ainda.</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4">
                        {teachers.map((teacher) => (
                            <UserCard
                                key={teacher.id}
                                user={teacher}
                                type="TEACHER"
                                editLink={`/admin/teachers/edit/${teacher.id}`}
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