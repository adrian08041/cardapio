import Link from "next/link";
import { Store, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RestaurantNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Store size={48} className="text-red-500" />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Restaurante não encontrado
        </h1>

        {/* Descrição */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          O restaurante que você está procurando não existe ou está
          temporariamente indisponível.
        </p>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/">
              <ArrowLeft size={18} />
              Voltar ao início
            </Link>
          </Button>

          <Button
            asChild
            className="gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
          >
            <Link href="/">Ver restaurantes</Link>
          </Button>
        </div>

        {/* Dica */}
        <p className="text-xs text-gray-400 mt-8">
          Verifique se o link está correto ou entre em contato com o
          restaurante.
        </p>
      </div>
    </div>
  );
}
