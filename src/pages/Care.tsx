import { Droplets, Sun, Wind, Thermometer } from 'lucide-react';
import { CareCard } from '../components/care/CareCard';
import { FloatingHearts } from '../components/shared/KawaiiElements/FloatingHearts';
import { CutePanda } from '../components/shared/KawaiiElements/CutePanda';

const careInstructions = [
  {
    id: 1,
    title: 'Lavagem',
    description: 'Lave suas peças de crochê à mão com água fria ou morna. Use sabão neutro e evite esfregar com força para não danificar as fibras. Não torcer e enxaguar com água corrente (tire o excesso da água com uma toalha).',
    Icon: Droplets
  },
  {
    id: 2,
    title: 'Secagem',
    description: 'Seque as peças na horizontal, sobre uma toalha limpa, longe da luz solar direta. Não torça o item, apenas pressione suavemente para remover o excesso de água.',
    Icon: Sun
  },
  {
    id: 3,
    title: 'Armazenamento',
    description: 'Guarde as peças dobradas em local fresco e seco. Evite pendurar itens de crochê, pois podem deformar devido ao próprio peso.',
    Icon: Wind
  },
  {
    id: 4,
    title: 'Temperatura',
    description: 'Não use água quente ou secadora. Altas temperaturas podem encolher ou deformar as peças de crochê.',
    Icon: Thermometer
  }
];

function Care() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative text-center mb-12">
        <FloatingHearts />
        <h1 className="font-handwritten text-6xl text-purple-800 mb-4">
          Cuidados com suas Peças
        </h1>
        <p className="font-kawaii text-gray-600 max-w-2xl mx-auto">
          Para que suas peças de crochê durem mais tempo e mantenham sua beleza,
          siga estas recomendações de cuidados especiais ✨
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careInstructions.map((instruction) => (
          <CareCard
            key={instruction.id}
            title={instruction.title}
            description={instruction.description}
            Icon={instruction.Icon}
          />
        ))}
      </div>
      <div className="mt-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-6 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">
            Dicas Adicionais
          </h2>
          <ul className="font-kawaii list-disc list-inside space-y-2 text-gray-700">
            <li>Evite usar alvejantes ou produtos químicos agressivos</li>
            <li>Para peças brancas, use água oxigenada volume 10 diluída</li>
            <li>Guarde as peças protegidas de poeira e insetos</li>
            <li>Não deixe de molho com outros produtos.</li>
            <li>Em caso de manchas, lave imediatamente com água fria</li>
          </ul>
        </div>
        <div className="ml-1">
          <CutePanda />
        </div>
      </div>
    </div>
  );
}

export default Care;