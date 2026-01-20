"use client";

import Button from "@/app/components/buttons";
import Input from "@/app/components/input";
import Label from "@/app/components/label";
import Toast, { ToastVariant } from "@/app/components/toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/app/services/authClient";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: ToastVariant } | null>(null);  
  const router = useRouter();

  const signInSchema = z.object({
    email: z.string({ message: "O e-mail é obrigatório" }).email("Informe um e-mail válido"),
    password: z.string({ message: "A senha é obrigatória" }).min(6, "A senha deve ter pelo menos 6 caracteres"),
  });

  const showToast = (message: string, variant: ToastVariant = "info") => {
    setToast({ message, variant });
  };

  const handleSubmit = async () => {
    // 1. Validação
    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Verifique os dados.";
      showToast(firstError, "warning");
      return;
    }

    setLoading(true);

    // 2. Login
    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      const errorMsg = error.message || ""; 
      if (errorMsg.includes("Invalid email or password")) {
        showToast("E-mail ou senha incorretos.", "alert");
      } else {
        showToast("Ocorreu um erro ao entrar.", "alert");
      }
      return;
    }

    // 3. Verifica a sessão para redirecionar corretamente
    const sessionData = await authClient.getSession();
    const user = sessionData.data?.user as any; 

    showToast("Login realizado! Redirecionando...", "success");

    // Redirecionamento baseado no Cargo
    if (user?.role === "ADMIN" || user?.role === "TEACHER") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-screen h-auto flex flex-col justify-center items-center mt-20 mb-20">
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
      <div className="w-2xl flex flex-col gap-6 p-10 border rounded-lg shadow-lg">
        {/* Campo de Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@exemplo.com"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* Campo de Senha - Agora simplificado! */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
          </div>
          
          {/* O Input detecta 'type="password"' e adiciona o botão sozinho */}
          <Input
            id="password"
            name="password"
            type="password" 
            placeholder="*********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Botão de Entrar */}
        <Button type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <p> Login </p>}
        </Button>

        {/* Link para Cadastro */}
        <div className="flex flex-col gap-2 mt-4 text-center">
          <span className="text-sm text-gray-500">Ainda não tem conta?</span>
          <Link href="/admin/signup" className="w-full">
            <Button variant="secondary" type="button">Primeiro Acesso</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}