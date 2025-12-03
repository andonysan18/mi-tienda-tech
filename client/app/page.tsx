import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      
      {/* SECCIÓN HERO (Principal) */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        {/* Un efecto de fondo sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full -z-10"></div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
          Tu Tecnología, <br /> Al Siguiente Nivel.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Somos expertos en dispositivos móviles. Encuentra el gadget que buscas o repara el que ya amas.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/store" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg shadow-blue-500/25"
          >
            🛒 Ir a la Tienda
          </Link>
          <Link 
            href="/repair/new" 
            className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-8 py-4 rounded-full font-bold text-lg transition"
          >
            🔧 Solicitar Reparación
          </Link>
        </div>
      </section>

      {/* SECCIÓN DE SERVICIOS (Tarjetas) */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* TARJETA TIENDA */}
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition group cursor-pointer relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-4xl mb-4 block">📱</span>
              <h2 className="text-3xl font-bold mb-2 group-hover:text-blue-400 transition">Venta de Accesorios</h2>
              <p className="text-slate-400 mb-6">
                Fundas, cargadores, auriculares y lo último en tecnología. Precios competitivos y garantía asegurada.
              </p>
              <Link href="/store" className="text-blue-400 font-bold hover:underline">
                Ver Catálogo →
              </Link>
            </div>
            {/* Decoración fondo */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition"></div>
          </div>

          {/* TARJETA TALLER */}
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-green-500 transition group cursor-pointer relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-4xl mb-4 block">🛠️</span>
              <h2 className="text-3xl font-bold mb-2 group-hover:text-green-400 transition">Servicio Técnico</h2>
              <p className="text-slate-400 mb-6">
                ¿Pantalla rota? ¿Batería muerta? Nuestros expertos lo solucionan. Diagnóstico rápido y repuestos originales.
              </p>
              <div className="flex gap-4">
                <Link href="/repair/new" className="text-green-400 font-bold hover:underline">
                  Solicitar Turno →
                </Link>
                <Link href="/repair/track" className="text-slate-400 hover:text-white text-sm flex items-center">
                  Rastrear equipo 🔎
                </Link>
              </div>
            </div>
            {/* Decoración fondo */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition"></div>
          </div>

        </div>
      </section>

      {/* CARACTERÍSTICAS (Trust Signals) */}
      <section className="border-t border-slate-800 bg-slate-900/50 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">🚀 Envíos Rápidos</h3>
            <p className="text-slate-500 text-sm">Recibe tus productos en 24/48hs en todo el país.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">🔒 Garantía Total</h3>
            <p className="text-slate-500 text-sm">3 meses de garantía en todas nuestras reparaciones.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">💳 Pagos Seguros</h3>
            <p className="text-slate-500 text-sm">Aceptamos todas las tarjetas y medios de pago.</p>
          </div>
        </div>
      </section>

    </div>
  );
}