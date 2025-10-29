import { BsBoxSeam } from "react-icons/bs"
import { GiPayMoney } from "react-icons/gi"
import { TbPigMoney } from "react-icons/tb"
import CountUp from '../components/ui/countup'


import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Dashboard() {

  const cards = [
              {
                icon: <GiPayMoney />,
                title: "Investimento",
                value: "200,00",
                color: "from-[#800020] to-pink-600",
              },
              {
                icon: <TbPigMoney />,
                title: "Vendas",
                value: "150,00",
                color: "from-[#800020] to-pink-600",
              },
              {
                icon: <BsBoxSeam />,
                title: "Estoque",
                value: "3",
                color: "from-[#800020] to-pink-600",
              },
            ]

    const dados = [
                  {
                    data: "12/10/2025",
                    cliente: "Nica",
                    quantidade: 20,
                    valor: "R$250,00",
                  },
                  {
                    data: "05/05/2025",
                    cliente: "Chico",
                    quantidade: 1,
                    valor: "R$10,00",
                  },
                  {
                    data: "06/04/2025",
                    cliente: "Schu",
                    quantidade: 50,
                    valor: "R$350,00",
                  },
                ]

  return (
    <section className="md:min-h-screen bg-gradient-to-br bg-white">

      <main className="">
        <div className="overflow-x-auto snap-x snap-mandatory mb-12">
          <div className="flex gap-6 p-5 md:px-8 md:justify-center">
            {cards.map((card, i) => (
              <div
                key={i}
                className={`h-56 w-80 flex-shrink-0 snap-center rounded-3xl p-6 text-white shadow-lg bg-gradient-to-br ${card.color} transition-transform hover:scale-105`}
              >
                <h1 className="text-2xl font-semibold flex gap-3 items-center">
                  {card.icon}
                  {card.title}
                </h1>
                <p className="font-bold text-5xl flex justify-center items-center mt-10">
                  
                  <CountUp
                    from={0}
                    to={card.value}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />
                   
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-100 text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Últimas vendas realizadas
              </h2>
              <p className="text-gray-500 text-sm">
                Atualizado em 21 de Outubro de 2025
              </p>
            </div>
        <div >
          <Table>
            <TableCaption className="text-gray-500 py-4">
              Dados simulados apenas para exibição
            </TableCaption>
            <TableHeader className="items-center">
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Dia</TableHead>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Unidades</TableHead>
                <TableHead className="font-semibold text-right">Valor (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-gray-700">
                    {row.data}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {row.cliente}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {row.quantidade}
                  </TableCell>
                  <TableCell className="text-right text-gray-800 font-semibold">
                    R$ {row.valor}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
          </div>
        </div>
      </main>
    </section>
  )
}
