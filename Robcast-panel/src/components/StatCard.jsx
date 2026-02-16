import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';

export default function StatCard({ title, value, trend, data, color = "text-blue-600" }) {
  const isPositive = trend?.includes('+');

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        {trend && (
          <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend}
          </span>
        )}
      </div>
      
      <div className="flex items-baseline gap-2 mb-4"> {/* Añadido mb-4 para espacio */}
        <h3 className={`text-3xl font-bold border-l-4 border-current pl-3 ${color}`}>
          {value}
        </h3>
      </div>

      {data && (
        <div className="h-12 w-full"> {/* Contenedor para la sparkline */}
          <Sparklines data={data} limit={10} width={100} height={20} margin={5}>
            <SparklinesLine style={{ strokeWidth: 2, stroke: isPositive ? "#10B981" : "#EF4444", fill: "none" }} /> {/* Color dinámico */}
            <SparklinesSpots style={{ fill: isPositive ? "#10B981" : "#EF4444" }} />
          </Sparklines>
        </div>
      )}
    </div>
  );
}