"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { authClient } from "@/services/authClient";
import { SessionUser } from "@/types";
import {
  PrimaryButton,
  SecondaryButton,
  TerciaryButton,
} from "../buttons/StyledButtons";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  padding: 1rem 2rem;
  width: 100%;
  box-shadow: none;
`;

const HeaderSeparator = styled.div`
  width: 100%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    flex-wrap: nowrap;
  }
`;

const Logo = styled.span`
  color: #000000;
  text-decoration: none;
  flex-shrink: 0;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`;

// --- NOVOS COMPONENTES DE ESTILO ---

// Agrupa as informações do usuário e o botão de sair
const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 1rem;
  border-left: 1px solid #e5e7eb; // Uma linha sutil separando a navegação do perfil

  @media (max-width: 768px) {
    border-left: none;
    padding-left: 0;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; // Alinha texto à direita
  line-height: 1.2;
  
  @media (max-width: 600px) {
    display: none; // Esconde em telas muito pequenas para não quebrar
  }
`;

const UserName = styled.span`
  font-size: 0.875rem; // 14px
  font-weight: 600;
  color: #1f2937;
`;

const UserRoleBadge = styled.span<{ $role?: string }>`
  font-size: 0.7rem; // 11px
  text-transform: uppercase;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  margin-top: 2px;
`;

// -----------------------------------

const Header: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const user = session?.user as SessionUser | undefined;

  const canManage =
    user?.appRole === "ADMIN" || user?.appRole === "TEACHER";

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  // Função auxiliar para traduzir o cargo visualmente
  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'TEACHER': return 'Professor';
      case 'STUDENT': return 'Aluno';
      default: return 'Visitante';
    }
  };

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <Link href="/">
            <Logo className="text-2xl font-bold">EducaMais</Logo>
          </Link>

          <Nav>
            {session ? (
              <>
                {/* Botões de Navegação */}
                {canManage && (
                  <>
                    <TerciaryButton
                      onClick={() => router.push("/admin/teachers")}
                      className="text-base font-medium md:text-[0.9375rem] sm:text-sm"
                    >
                      Professores
                    </TerciaryButton>

                    <TerciaryButton
                      onClick={() => router.push("/admin/students")}
                      className="text-base font-medium md:text-[0.9375rem] sm:text-sm"
                    >
                      Alunos
                    </TerciaryButton>

                    <TerciaryButton
                      onClick={() => router.push("/admin/dashboard")}
                      className="font-medium text-base md:text-[0.9375rem] sm:text-sm"
                    >
                      Postagens
                    </TerciaryButton>

                    <PrimaryButton
                      onClick={() => router.push("/admin/posts/create")}
                      className="text-base font-medium md:text-[0.9375rem] sm:text-sm"
                    >
                      + Criar Conteúdo
                    </PrimaryButton>
                  </>
                )}

                {/* Seção do Usuário (Nome + Logout) */}
                <UserSection>
                  <UserInfo>
                    <UserName>{user?.name?.split(' ')[0]}</UserName> {/* Mostra só o primeiro nome */}
                    <UserRoleBadge $role={user?.appRole}>
                      {getRoleLabel(user?.appRole)}
                    </UserRoleBadge>
                  </UserInfo>

                  <SecondaryButton
                    onClick={handleLogout}
                    className="font-medium text-base md:text-[0.9375rem] sm:text-sm"
                  >
                    Sair
                  </SecondaryButton>
                </UserSection>
              </>
            ) : (
              <TerciaryButton
                onClick={() => router.push("/admin/signin")}
                className="font-medium text-base md:text-[0.9375rem] sm:text-sm"
              >
                Entrar
              </TerciaryButton>
            )}
          </Nav>
        </HeaderContent>
      </HeaderContainer>
      <HeaderSeparator />
    </>
  );
};

export default Header;