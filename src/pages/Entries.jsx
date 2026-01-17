export default function Entries() {
  const bullishSetups = [
    {
      title: "Sweep + BOS",
      teoria:
        "https://res.cloudinary.com/ds0fepc91/image/upload/v1767147645/TAS1TE_rere0e.png",
      ejemplo:
        "https://res.cloudinary.com/ds0fepc91/image/upload/v1767147645/TAS1EX_kwyau9.png",
    },
    {
      title: "Inducement + IDM",
      teoria:
        "https://res.cloudinary.com/ds0fepc91/image/upload/v1767147645/TAS2TE_ewf8c1.png",
      ejemplo:
        "https://res.cloudinary.com/ds0fepc91/image/upload/v1767147645/TAS2EX_rrovtx.png",
    },
    {
      title: "OB + FVG",
      teoria:
        "https://res.cloudinary.com/ds0fepc91/image/upload/v1767147645/TAS3TE_apd3b5.png",
      ejemplo:
        "https://res.cloudinary.com/ds0fepc91/image/upload/v1767147645/TAS3EX_byujbd.png",
    },
  ];

  const bearishSetups = [
    {
      title: "Sweep + BOS",
      teoria:
        "https://res.cloudinary.com/ds0fepc91/image/upload/v1767147645/TBS1TE_ux4c5m.png",
      ejemplo:
        "https://res.cloudinary.com/ds0fepc91/image/upload/v1767147645/TBS1EX_s3ds6r.png",
    },
    {
      title: "Inducement + IDM",
      teoria:
        "https://res.cloudinary.com/ds0fepc91/image/upload/v1767147644/TBS2TE_eugrut.png",
      ejemplo:
        "https://res.cloudinary.com/ds0fepc91/image/upload/v1767147644/TBS2EX_oofvsg.png",
    },
    {
      title: "OB + FVG",
      teoria:
        "https://res.cloudinary.com/ds0fepc91/image/upload/v1767147644/TBS3TE_bt3vo1.png",
      ejemplo:
        "https://res.cloudinary.com/ds0fepc91/image/upload/v1767147644/TBS3EX_zrbfl9.png",
    },
  ];

  return (
    <div className="w-full px-6 py-6">
      <div className="max-w-7xl mx-auto space-y-16 text-zinc-200">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-zinc-100">Entry Setups</h1>
          <p className="text-zinc-400">
            Configuraciones operativas basadas en estructura e inducement
          </p>
        </header>

        {/* ===== ALCISTAS ===== */}
        <section className="space-y-8">
          <SectionTitle>Tendencias Alcistas</SectionTitle>

          {bullishSetups.map((s, i) => (
            <SetupCard
              key={i}
              title={s.title}
              imgTeoria={s.teoria}
              imgExample={s.ejemplo}
            />
          ))}
        </section>

        {/* ===== BAJISTAS ===== */}
        <section className="space-y-8">
          <SectionTitle>Tendencias Bajistas</SectionTitle>

          {bearishSetups.map((s, i) => (
            <SetupCard
              key={i}
              title={s.title}
              imgTeoria={s.teoria}
              imgExample={s.ejemplo}
            />
          ))}
        </section>
      </div>
    </div>
  );
}

/* ================= UI ================= */

function SectionTitle({ children }) {
  return (
    <h2 className="text-2xl font-semibold text-zinc-100 border-b border-zinc-800 pb-2">
      {children}
    </h2>
  );
}

function SetupCard({ title, imgTeoria, imgExample }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
      <h3 className="text-xl font-semibold text-zinc-100">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageBlock src={imgTeoria} label="Teoría" />
        <ImageBlock src={imgExample} label="Ejemplo" />
      </div>

      <button className="mt-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-sm">
        Usar este setup
      </button>
    </div>
  );
}

function ImageBlock({ src, label }) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-zinc-400">{label}</div>
      <img
        src={src}
        alt={label}
        className="rounded-lg border border-zinc-800 w-full"
      />
    </div>
  );
}
