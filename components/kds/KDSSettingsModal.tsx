"use client";

import { useState } from "react";
import { Lock, Volume2, Printer, Monitor, X, Check } from "lucide-react";

interface KDSSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: KDSSettings) => void;
  currentSettings: KDSSettings;
}

export interface KDSSettings {
  station: "all" | "kitchen" | "bar" | "dessert";
  soundEnabled: boolean;
  autoPrint: boolean;
  columns: 2 | 3 | 4;
}

export function KDSSettingsModal({
  isOpen,
  onClose,
  onSave,
  currentSettings,
}: KDSSettingsModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [tempSettings, setTempSettings] =
    useState<KDSSettings>(currentSettings);

  if (!isOpen) return null;

  const handleLogin = () => {
    if (password === "1234") {
      setIsAuthenticated(true);
    } else {
      alert("Senha incorreta");
      setPassword("");
    }
  };

  const handleSave = () => {
    onSave(tempSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
          <h2 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2">
            <Monitor size={18} /> Configuração da Estação
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <div className="text-center mb-2">
                <Lock size={48} className="mx-auto text-gray-600 mb-2" />
                <p className="text-gray-400 text-sm">
                  Área restrita a gerentes.
                </p>
              </div>
              <input
                type="password"
                placeholder="Senha (1234)"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-center text-xl tracking-widest focus:ring-2 focus:ring-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg uppercase transition-colors"
              >
                Acessar
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Seletor de Estação */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Filtrar por Setor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["all", "kitchen", "bar", "dessert"] as const).map(
                    (station) => (
                      <button
                        key={station}
                        onClick={() =>
                          setTempSettings({ ...tempSettings, station })
                        }
                        className={`p-3 rounded border text-sm font-bold uppercase ${
                          tempSettings.station === station
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750"
                        }`}
                      >
                        {station === "all" ? "Toda a Cozinha" : station}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded border border-gray-700">
                  <div className="flex items-center gap-3">
                    <Volume2
                      className={
                        tempSettings.soundEnabled
                          ? "text-green-500"
                          : "text-gray-500"
                      }
                    />
                    <span className="font-medium">Sons de Alerta</span>
                  </div>
                  <button
                    onClick={() =>
                      setTempSettings((s) => ({
                        ...s,
                        soundEnabled: !s.soundEnabled,
                      }))
                    }
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${tempSettings.soundEnabled ? "bg-green-600" : "bg-gray-600"}`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform ${tempSettings.soundEnabled ? "translate-x-6" : ""}`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-gray-800 p-3 rounded border border-gray-700">
                  <div className="flex items-center gap-3">
                    <Printer
                      className={
                        tempSettings.autoPrint
                          ? "text-green-500"
                          : "text-gray-500"
                      }
                    />
                    <span className="font-medium">Impressão Automática</span>
                  </div>
                  <button
                    onClick={() =>
                      setTempSettings((s) => ({
                        ...s,
                        autoPrint: !s.autoPrint,
                      }))
                    }
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${tempSettings.autoPrint ? "bg-green-600" : "bg-gray-600"}`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform ${tempSettings.autoPrint ? "translate-x-6" : ""}`}
                    />
                  </button>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full mt-4 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 uppercase"
              >
                <Check size={20} /> Salvar Configurações
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
