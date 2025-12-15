"use client";

import Button from "@/app/components/button";
import Input from "@/app/components/input";
import Label from "@/app/components/label";
import Toast, {ToastVariant} from "@/app/components/toast";
import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { authClient } from "@/app/services/authClient";
import { useRouter } from "next/navigation";
import { z } from "zod";

export default function SignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState<{ message: string; variant: ToastVariant } | null>(null);

	const signUpSchema = z.object({
		name: z.string({ message: "O nome é obrigatório" }).min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string({ message: "O e-mail é obrigatório" }).email("Informe um e-mail válido"),
    password: z.string({ message: "A senha é obrigatória" }).min(6, "A senha deve ter pelo menos 6 caracteres"),
		passwordConfirmation: z.string({ message: "A confirmação de senha é obrigatória" }),
  }).refine((data) => data.password === data.passwordConfirmation, {
		message: "As senhas não coincidem",
	});

  const showToast = (message: string, variant: ToastVariant = "info") => {
    setToast({ message, variant });
  };

  const handleSubmit = async () => {
    const result = signUpSchema.safeParse({ name, email, password, passwordConfirmation });
    if (!result.success) {
      const firstError =
        result.error.issues[0]?.message || "Verifique os dados informados.";
      showToast(firstError, "warning");
      return;
    }

    try {
      await authClient.signUp.email(
        {
					name,
          email,
          password,
          callbackURL: "/admin/dashboard",
        },
        {
          onRequest: () => setLoading(true),
          onResponse: () => setLoading(false),
          onError: () => setLoading(false),
        }
      );
      showToast("Cadastro realizado com sucesso!", "success");
    } catch (err) {
      setLoading(false);
      showToast("Falha ao cadastrar. Verifique suas informações.", "alert");
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
						<div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="João Silva"
                    required
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    value={name}
                  />
                </div>
              <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    required
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    value={email}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    
                  </div>

                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="*********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

								<div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="passwordConfirmation">Confirmar Senha</Label>
                    
                  </div>

                  <Input
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    type="password"
                    placeholder="*********"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                  />
                </div>

                

              

              <Button
                  type="submit"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <p> Cadastrar </p>
                  )}
                  </Button>

          
              </div>
          
        </div>

  );
}