import { useForm } from "react-hook-form";

export function FormLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <div className="w-full">
<     form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-5 text-white"
      >
      <div className="flex flex-col gap-1">
            <label className="bg-transparent text-sm text-gray-200">
                Email           
            </label>
        <input
          placeholder="Email"
          type="email"
          {...register("Email", {
            required: "O Email é obrigatório",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Digite um email válido",
            },
          })}
          className="w-80 md:w-100 p-5 h-15 rounded-lg bg-white/20 text-white  placeholder-gray-200 
                     border border-white/30 focus:outline-none focus:ring-2 
                     focus:ring-[#A04058] focus:border-transparent transition-all"
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
          {...register("Senha", {
            required: "A Senha é obrigatória",
            minLength: {
              value: 6,
              message: "A senha deve ter no mínimo 6 caracteres",
            },
          })}
          className="w-80 md:w-100 p-5 h-15 rounded-lg bg-white/20 text-white placeholder-gray-200 
                     border border-white/30 focus:outline-none focus:ring-2 
                     focus:ring-[#A04058] focus:border-transparent transition-all"
        />
        {errors.Senha && (
          <span className="text-red-300 text-sm font-medium">
            {errors.Senha.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="h-15 w-40 bg-gradient-to-r from-[#800020] to-[#A04058] text-white 
                   font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] 
                   transition-all shadow-md"
      >
        Entrar
      </button>
    </form>
    </div>
    
  );
}