"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Wait for hydration (persist store)
    // Actually persist middleware handles hydration, but we might want a small delay or check isHydrated
    // Assuming simple check works for now.

    if (useAuthStore.persist.hasHydrated()) {
      checkAuth();
    } else {
      useAuthStore.persist.onFinishHydration(() => checkAuth());
    }
  }, []);

  const checkAuth = () => {
    const state = useAuthStore.getState();
    if (!state.isAuthenticated || !state.user) {
      router.replace("/login");
      return;
    }

    // Check role
    const role = state.user.role;
    console.log("Admin Check - Role:", role);
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      // router.replace("/");
      // return;
      setIsChecked(false); // Retorna falso para mostrar msg abaixo
      return; // Para execucao
    }

    setIsChecked(true);
  };

  if (!isChecked) {
    if (
      useAuthStore.getState().isAuthenticated &&
      useAuthStore.getState().user?.role !== "ADMIN"
    ) {
      return (
        <div className="flex h-screen flex-col items-center justify-center bg-[var(--color-background)] gap-4">
          <h1 className="text-xl font-bold text-red-500">Acesso Negado</h1>
          <p>
            Seu perfil de usuário ({useAuthStore.getState().user?.role}) não tem
            permissão.
          </p>
          <button
            onClick={() => {
              router.push("/");
            }}
            className="underline"
          >
            Voltar para Home
          </button>
        </div>
      );
    }
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-background)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <AdminSidebar />
      <main className="md:ml-64 p-8 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
