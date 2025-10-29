import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { withMask } from "use-mask-input";

export function FormSignup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);
  const phoneRef = useRef(null)

  useEffect(()=> {
    if(phoneRef.current){
        withMask('(99) 99999-9999')(phoneRef.current)
    }
  },[])
  

  return (
    <div className="w-full">
<     form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-5 text-white"
      >
      <div className="flex flex-col gap-1">
            <label className="bg-transparent text-sm text-gray-200">
                Nome completo            
            </label>
        <input
          placeholder="Nome completo"
          type="name"
          {...register("name", {
            required: "O Nome é obrigatório",
            minLength: 3,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Digite um nome válido",
            },
          })}
          className="w-80 md:w-100 p-5 h-15 rounded-lg bg-white/20 text-white  placeholder-gray-200 
                     border border-white/30 focus:outline-none focus:ring-2 
                     focus:ring-[#A04058] focus:border-transparent transition-all"
        />
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
      
      <div className="flex flex-col gap-1">
        <label className="bg-transparent text-sm text-gray-200">
            Data de nascimento            
            </label>
        <input
            placeholder="Data de nascimento"
            type="date"
            id="data_nascimento"
            {...register("data_nascimento", {
              required: "A data de nascimento é obrigatória",
            })}
            min="1900-01-01"
            max={new Date().toISOString().split("T")[0]} 
          
          className="w-80 md:w-100 p-5 h-15 rounded-lg bg-white/20 text-white  placeholder-gray-200 
                     border border-white/30 focus:outline-none focus:ring-2 
                     focus:ring-[#A04058] focus:border-transparent transition-all"
        />
            <label className="bg-transparent text-sm text-gray-200">
                Telefone           
            </label>
        <input
        placeholder="Telefone"
        type="text"
        {...register("Telefone", {
          required: "O telefone é obrigatório",
        })}
        ref={(e) => {
          register("Telefone").ref(e);
          phoneRef.current = e; 
        }}
        className="w-80 md:w-100 p-5 h-15 rounded-lg bg-white/20 text-white placeholder-gray-200 
                   border border-white/30 focus:outline-none focus:ring-2 
                   focus:ring-[#A04058] focus:border-transparent transition-all"
      />

      {errors.Telefone && (
        <span className="text-red-300 text-sm font-medium">
          {errors.Telefone.message}
        </span>
      )}
      </div>
      

      <div className="flex flex-col gap-1">
        <button
            type="submit"
            className="h-15 w-40 bg-gradient-to-r from-[#800020] to-[#A04058] text-white 
                       font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] 
                       transition-all shadow-md"
        >
            Cadastrar
        </button>
      </div>

     
    </form>
    </div>
    
  );
}