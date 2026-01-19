"use client";
import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/services/authClient";
import { SessionUser } from "@/app/types";
import { PrimaryButton, SecondaryButton, TerciaryButton } from "../buttons/StyledButtons";

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

const Header: React.FC = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  // Casting para garantir que o TS entenda o campo 'role'
  const user = session?.user as SessionUser | undefined;

  // Lógica de Permissão: Quem pode ver os botões de gestão?
  const canManage = user?.role === "ADMIN" || user?.role === "TEACHER";

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
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
              // --- ÁREA LOGADA ---
              <>
                {/* Botões de Gestão (Só aparecem se for Admin ou Professor) */}
                {canManage && (
                  <>
                    <Link href="/admin/teachers">
                      <TerciaryButton className="text-base font-medium md:text-[0.9375rem] sm:text-sm">
                        Professores
                      </TerciaryButton>
                    </Link>

                    <Link href="/admin/students">
                      <TerciaryButton className="text-base font-medium md:text-[0.9375rem] sm:text-sm">
                        Alunos
                      </TerciaryButton>
                    </Link>
                  </>
                )}

                <Link href="/admin/dashboard">
                  <TerciaryButton className="font-medium text-base md:text-[0.9375rem] sm:text-sm">
                    Painel
                  </TerciaryButton>
                </Link>

                <Link href="/admin/create">
                  <PrimaryButton className="text-base font-medium md:text-[0.9375rem] sm:text-sm">
                    + Nova Postagem
                  </PrimaryButton>
                </Link>

                <SecondaryButton
                  onClick={handleLogout}
                  className="font-medium text-base md:text-[0.9375rem] sm:text-sm"
                >
                  Sair
                </SecondaryButton>
              </>
            ) : (
              // --- ÁREA DESLOGADA ---
              <Link href="/admin/signin">
                <TerciaryButton className="font-medium text-base md:text-[0.9375rem] sm:text-sm">
                  Entrar
                </TerciaryButton>
              </Link>
            )}
          </Nav>
        </HeaderContent>
      </HeaderContainer>
      <HeaderSeparator />
    </>
  );
};

export default Header;