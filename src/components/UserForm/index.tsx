"use client";

import React, { useState } from "react";
import Button from "@/components/buttons";
import Input from "@/components/input";
import Label from "@/components/label";
import { Loader2 } from "lucide-react";
import { UserRole } from "@/types";

interface UserFormProps {
    initialData?: {
        name: string;
        email: string;
    };
    targetRole: UserRole; // "TEACHER" ou "STUDENT"
    onSubmit: (data: any) => Promise<void>;
    isSubmitting: boolean;
    isEditing?: boolean;
}

export default function UserForm({
    initialData,
    targetRole,
    onSubmit,
    isSubmitting,
    isEditing = false
}: UserFormProps) {

    const [name, setName] = useState(initialData?.name || "");
    const [email, setEmail] = useState(initialData?.email || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name || !email) {
            setError("Preencha nome e email.");
            return;
        }

        if (!isEditing) {
            if (!password) {
                setError("A senha é obrigatória.");
                return;
            }
            if (password !== confirmPassword) {
                setError("As senhas não coincidem.");
                return;
            }
            if (password.length < 6) {
                setError("A senha deve ter no mínimo 8 caracteres.");
                return;
            }
        } else {
            if (password && password !== confirmPassword) {
                setError("As senhas não coincidem.");
                return;
            }
        }

        const formData = {
            name,
            email,
            role: targetRole,
            ...(password ? { password } : {}),
        };

        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-md border border-gray-100">

            {error && (
                <div className="p-3 bg-red-100 text-red-700 text-sm rounded">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Ex: Ana Souza"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ana@escola.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <hr className="border-gray-200 my-2" />

            <div className="flex flex-col gap-2">
                <Label htmlFor="password">
                    {isEditing ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                </Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!isEditing}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="******"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={!isEditing}
                />
            </div>

            <div className="pt-2 w-full flex flex-col">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <p>{isEditing ? "Salvar Alterações" : `Cadastrar ${targetRole === 'TEACHER' ? 'Professor' : 'Aluno'}`}</p>
                    )}
                </Button>
            </div>
        </form>
    );
}