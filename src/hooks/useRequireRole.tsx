"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/services/authClient"
import { SessionUser } from "@/types";

export function useRequireRole(allowedRoles: Array<SessionUser["appRole"]>) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending) return

    const user = session?.user as SessionUser | undefined

    if (!user || !allowedRoles.includes(user.appRole)) {
      router.push("/")
    }
  }, [session, isPending, allowedRoles, router])
}
