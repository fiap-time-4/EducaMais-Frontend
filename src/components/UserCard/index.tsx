"use client";

import React from "react";
import Link from "next/link";
import { User } from "@/types";
import { Mail, User as UserIcon, Trash2, Edit } from "lucide-react";

interface UserCardProps {
  user: User;
  type: "TEACHER" | "STUDENT" | "ADMIN";
  editLink: string;
  onDelete: (id: string) => void;
}

export default function UserCard({ user, type, editLink, onDelete }: UserCardProps) {
  const roleConfig = {
    TEACHER: {
      label: "Professor",
      style: "text-orange-500 bg-orange-50 border-orange-100",
    },
    STUDENT: {
      label: "Aluno",
      style: "text-blue-500 bg-blue-50 border-blue-100",
    },
    ADMIN: {
      label: "Administrador",
      style: "text-purple-500 bg-purple-50 border-purple-100",
    },
  };

  const currentRole = roleConfig[type];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Lado Esquerdo: Informações */}
      <div className="flex-1 w-full">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <UserIcon size={20} className="text-gray-400" />
          {user.name}
        </h2>

        <div className="flex items-center gap-2 mt-2 text-gray-600">
          <Mail size={16} />
          <span>{user.email}</span>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span
            className={`text-xs font-medium px-2 py-1 rounded uppercase tracking-wider border ${currentRole.style}`}
          >
            {currentRole.label}
          </span>
          {/* Proteção para ID curto */}
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-2">
            ID: {user.id?.slice(0, 3)}...
          </span>
        </div>
      </div>

      {/* Lado Direito: Botões */}
      <div className="flex gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
        <Link
          href={editLink}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 text-indigo-600 hover:bg-indigo-50 font-medium text-sm border border-indigo-200 px-4 py-2 rounded transition-all"
        >
          <Edit size={16} />
          Editar
        </Link>

        <button
          onClick={() => onDelete(user.id)}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 font-medium text-sm border border-red-200 px-4 py-2 rounded transition-all"
        >
          <Trash2 size={16} />
          Excluir
        </button>
      </div>
    </div>
  );
}