import fundo from "../../public/juliana_estetica.jpg";
import { FormSignup } from "../components/formSignup";
import logo from "../../public/logo.svg";


export default function Signup() {



  return (
    <section className="relative min-h-screen w-screen flex items-center justify-center p-4 overflow-y-auto">
      <img
        src={fundo}
        alt="Fundo"
        className="fixed inset-0 w-full h-full object-cover brightness-50"
      />

      <a 
        href="/login"
        className="fixed top-6 left-6 z-20 px-6 py-3 bg-white/20 backdrop-blur-md 
                   border border-white/30 rounded-lg text-white font-semibold
                   hover:bg-white/30 transition-all"
      >
        ← Voltar para o login
      </a>

      <div className="relative z-10 w-full max-w-md my-20 flex flex-col bg-white/20 
                      backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl">
        
        <div className="flex justify-center items-center pt-6">
                  <img 
                    src={logo} 
                    alt="Logo Juliana" 
                    width={100}
                    className="mx-auto"
                  />
                </div>
        <div className="p-6">
          <FormSignup />
        </div>

      
      </div>
    </section>
  );
}