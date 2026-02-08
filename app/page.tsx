import { redirect } from "next/navigation";

/**
 * Página inicial do sistema
 *
 * Por enquanto, redireciona para o cardápio de demonstração.
 * No futuro, pode ser uma landing page de marketing ou
 * listagem de restaurantes disponíveis.
 */
export default function HomePage() {
  // Redireciona para o cardápio demo
  redirect("/r/demo/cardapio");
}

