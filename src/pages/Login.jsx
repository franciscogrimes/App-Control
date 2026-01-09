import { FormLogin } from "../components/formLogin";
import fundo from "../../public/juliana_estetica.jpg";
import logo from "../../public/logo.svg";

export default function Login() {
  return (
    <section className="relative min-h-screen w-screen flex items-center justify-center p-4 overflow-y-auto">
      <img
        src={fundo}
        alt="Fundo"
        className="absolute inset-0 w-full h-full object-cover brightness-50"
      />

      <div className="relative z-10 w-90 md:w-120 h-130 flex flex-col justify-between bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="flex justify-center items-center pt-6">
          <img 
            src={logo} 
            alt="Logo Juliana" 
            width={100}
            className="mx-auto"
          />
        </div>

        <div className="flex-grow flex items-center justify-center px-6">
          <FormLogin />
        </div>

        
      </div>
    </section>
  );
}
