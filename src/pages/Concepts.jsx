export default function Concepts() {
  return (
    <div className="w-full px-4 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* ===== SIDEBAR ===== */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-4">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
              Contenido
            </h2>

            <nav className="space-y-2 text-sm">
              <NavLink href="#liquidez">Liquidez</NavLink>
              <NavLink href="#estructura">Estructura</NavLink>
              <NavLink href="#direccion">Dirección</NavLink>
              <NavLink href="#choch">CHOCH</NavLink>
              <NavLink href="#entradas">Entradas</NavLink>
            </nav>
          </div>
        </aside>

        {/* ===== CONTENT ===== */}
        <main className="flex-1 space-y-12 text-zinc-200">
          {/* ===== HEADER ===== */}
          <header className="space-y-2">
            <h1 className="text-3xl font-bold text-zinc-100">ICT Concepts</h1>
            <p className="text-zinc-400">
              Liquidez, estructura, dirección y criterios de entrada
            </p>
          </header>

          {/* ================= LIQUIDEZ ================= */}
          <Section id="liquidez" title="Liquidez">
            <Card>
              <h3 className="card-title">Inducement / Liquidez</h3>

              <SubTitle>Impulso alcista</SubTitle>
              <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                <li>Neutralización del mínimo previo</li>
                <li>Generación de nuevo máximo</li>
              </ol>

              <Note>
                Si ocurre en una sola vela, esperar confirmación adicional.
              </Note>

              <SubTitle className="mt-6">Impulso bajista</SubTitle>
              <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                <li>Neutralización del máximo previo</li>
                <li>Generación de nuevo mínimo</li>
              </ol>
            </Card>
          </Section>

          {/* ================= ESTRUCTURA ================= */}
          <Section id="estructura" title="Estructura">
            <Card>
              <p className="text-zinc-300">
                Los máximos y mínimos estructurales se definen cuando el
                pullback invalida otros IDM.
              </p>
            </Card>
          </Section>

          {/* ================= DIRECCIÓN ================= */}
          <Section id="direccion" title="Dirección">
            <Card>
              <h3 className="card-title">BOS – Break of Structure</h3>

              <SubTitle>Tendencia alcista</SubTitle>
              <ul className="list-disc list-inside text-zinc-300">
                <li>Ruptura de máximo válido</li>
                <li>Cierre con cuerpo</li>
              </ul>

              <SubTitle className="mt-6">Tendencia bajista</SubTitle>
              <ul className="list-disc list-inside text-zinc-300">
                <li>Ruptura de mínimo válido</li>
                <li>Cierre con cuerpo</li>
              </ul>
            </Card>
          </Section>

          {/* ================= CHOCH ================= */}
          <Section id="choch" title="CHOCH – Cambio de carácter">
            <Card>
              <p className="text-zinc-300">
                Un CHOCH invalida la estructura previa y suele anticipar un
                cambio de dirección.
              </p>
            </Card>
          </Section>

          {/* ================= ENTRADAS ================= */}
          <Section id="entradas" title="Entradas">
            <Card>
              <ul className="list-disc list-inside space-y-2 text-zinc-300">
                <li>Sweep inducement</li>
                <li>Mitigación POI</li>
                <li>OB + FVG + IDM</li>
              </ul>

              <a
                href="/entries"
                className="inline-block mt-6 text-blue-400 hover:text-blue-300"
              >
                → Ver setups de entrada
              </a>
            </Card>
          </Section>
        </main>
      </div>
    </div>
  );
}

/* ===== UI HELPERS ===== */

function Section({ id, title, children }) {
  return (
    <section id={id} className="space-y-4 scroll-mt-24">
      <h2 className="text-2xl font-semibold text-zinc-100">{title}</h2>
      {children}
    </section>
  );
}

function Card({ children }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
      {children}
    </div>
  );
}

function SubTitle({ children, className = "" }) {
  return (
    <h4 className={`text-lg font-semibold text-zinc-100 ${className}`}>
      {children}
    </h4>
  );
}

function Note({ children }) {
  return (
    <div className="bg-zinc-800/60 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-300">
      <b className="text-zinc-100">Nota:</b> {children}
    </div>
  );
}

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="block text-zinc-400 hover:text-zinc-100 transition"
    >
      {children}
    </a>
  );
}
