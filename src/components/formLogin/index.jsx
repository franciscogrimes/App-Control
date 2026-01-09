import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPasswordAuth } from '../../services/firebase/auth';

export function FormLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage("");
    
    const result = await signInWithEmailAndPasswordAuth(data.Email, data.Senha);
    
    if (result.success) {
      navigate("/dashboard");
    } else {
      // Mensagens de erro em português
      const errorMessages = {
        'auth/invalid-credential': 'Email ou senha incorretos',
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
        'auth/network-request-failed': 'Erro de conexão. Verifique sua internet'
      };
      
      setErrorMessage(errorMessages[result.error] || 'Erro ao fazer login');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-5 text-white"
      >
        {errorMessage && (
          <div className="w-80 md:w-100 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <span className="text-red-300 text-sm">{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="bg-transparent text-sm text-gray-200">
            Email           
          </label>
          <input
            placeholder="Email"
            type="email"
            disabled={isLoading}
            {...register("Email", {
              required: "O Email é obrigatório",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Digite um email válido",
              },
            })}
            className="w-80 md:w-100 p-5 h-15 rounded-lg bg-white/20 text-white placeholder-gray-200 
                       border border-white/30 focus:outline-none focus:ring-2 
                       focus:ring-[#A04058] focus:border-transparent transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.Email && (
            <span className="text-red-300 text-sm font-medium">
              {errors.Email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="bg-transparent text-sm text-gray-200">
            Senha           
          </label>
          <input
            placeholder="Senha"
            type="password"
            disabled={isLoading}
            {...register("Senha", {
              required: "A Senha é obrigatória",
              minLength: {
                value: 6,
                message: "A senha deve ter no mínimo 6 caracteres",
              },
            })}
            className="w-80 md:w-100 p-5 h-15 rounded-lg bg-white/20 text-white placeholder-gray-200 
                       border border-white/30 focus:outline-none focus:ring-2 
                       focus:ring-[#A04058] focus:border-transparent transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.Senha && (
            <span className="text-red-300 text-sm font-medium">
              {errors.Senha.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="h-15 w-40 bg-gradient-to-r from-[#800020] to-[#A04058] text-white 
                     font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] 
                     transition-all shadow-md mt-10 disabled:opacity-50 
                     disabled:cursor-not-allowed"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}