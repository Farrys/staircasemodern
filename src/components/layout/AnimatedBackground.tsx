import { useTheme } from '@/contexts/ThemeContext';

export function AnimatedBackground() {
  const { theme } = useTheme();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ background: `linear-gradient(180deg, var(--page-grad-start) 0%, var(--page-grad-mid) 38%, var(--page-grad-end) 100%)` }}>
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute inset-0 bg-grain-soft opacity-80" />
      {theme === 'dark' ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.035),transparent_38%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(214,186,120,0.06),transparent_32%)]" />
          <div className="absolute left-[8%] top-[-10%] h-[135%] w-[7rem] rounded-full bg-[linear-gradient(180deg,rgba(214,186,120,0),rgba(214,186,120,0.2),rgba(214,186,120,0))] opacity-55 blur-[26px] animate-wave" />
          <div className="absolute right-[9%] top-[-14%] h-[140%] w-[6rem] rounded-full bg-[linear-gradient(180deg,rgba(214,186,120,0),rgba(214,186,120,0.16),rgba(214,186,120,0))] opacity-50 blur-[24px] animate-float" />
          <div className="absolute left-[12%] top-[12%] h-[72%] w-[76%] rounded-[2.4rem] border border-white/[0.045] bg-[linear-gradient(180deg,rgba(255,255,255,0.018),rgba(255,255,255,0))]" />
          <div className="absolute left-[-8%] top-[18%] h-[42rem] w-[118%] rounded-[100%] border border-white/[0.045] opacity-45 animate-wave" />
          <div className="absolute left-[-12%] top-[22%] h-[44rem] w-[118%] rounded-[100%] border border-brand/10 opacity-35 animate-wave" />
          <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(214,186,120,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(214,186,120,0.06)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
          <div className="absolute left-[7%] top-[16%] h-72 w-72 rounded-[3rem] border border-white/[0.06] opacity-45 animate-float" />
          <div className="absolute left-[10%] top-[20%] h-72 w-72 rounded-[3rem] border-l-[12px] border-b-[12px] border-l-brand/10 border-b-brand/10 opacity-70 animate-drift" />
          <div className="absolute right-[8%] bottom-[15%] h-80 w-80 rounded-[3.25rem] border border-brand/12 opacity-45 animate-pulseSlow" />
          <div className="absolute right-[11%] bottom-[19%] h-80 w-80 rounded-[3.25rem] border-r-[12px] border-t-[12px] border-r-white/[0.08] border-t-white/[0.08] opacity-70 animate-float" />
          <div className="absolute left-[38%] top-[10%] h-[18rem] w-[18rem] rotate-12 rounded-[3rem] border border-white/[0.05] opacity-28 animate-drift" />
          <div className="absolute bottom-[18%] left-[18%] h-20 w-[24rem] rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(214,186,120,0.22),rgba(255,255,255,0))] opacity-40 blur-2xl animate-wave" />
          <div className="absolute right-[18%] top-[12%] h-[16rem] w-[8rem] rounded-[999px] border border-brand/10 opacity-25 blur-[1px] animate-float" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.42))]" />
        </>
      ) : (
        <>
          <div className="absolute -left-24 top-12 h-96 w-96 rounded-full bg-[#d9b793]/35 blur-3xl animate-drift" />
          <div className="absolute right-[-4rem] top-[18%] h-[30rem] w-[30rem] rounded-full bg-[#efdbbd]/55 blur-3xl animate-pulseSlow" />
          <div className="absolute bottom-[-4rem] left-[28%] h-96 w-96 rounded-full bg-[#a56d42]/16 blur-3xl animate-float" />
          <div className="absolute left-[-10%] top-[18%] h-[40rem] w-[120%] rounded-[100%] border border-white/30 opacity-45 animate-wave" />
          <div className="absolute left-[-15%] top-[22%] h-[42rem] w-[120%] rounded-[100%] border border-[#dcbf9f]/45 opacity-40 animate-wave" />
          <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(138,90,54,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(138,90,54,0.06)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
          <div className="absolute left-[8%] top-[14%] h-64 w-64 rounded-[2.5rem] border border-[#d2b292]/35 opacity-50 animate-float" />
          <div className="absolute left-[12%] top-[18%] h-64 w-64 rounded-[2.5rem] border-l-[10px] border-b-[10px] border-l-[#b47d51]/20 border-b-[#b47d51]/20 opacity-70 animate-drift" />
          <div className="absolute right-[8%] bottom-[16%] h-72 w-72 rounded-[3rem] border border-[#d9b793]/40 opacity-45 animate-pulseSlow" />
          <div className="absolute right-[12%] bottom-[20%] h-72 w-72 rounded-[3rem] border-r-[12px] border-t-[12px] border-r-[#8a5a36]/18 border-t-[#8a5a36]/18 opacity-75 animate-float" />
          <div className="absolute left-[38%] top-[10%] h-[18rem] w-[18rem] rotate-12 rounded-[3rem] border border-white/25 opacity-35 animate-drift" />
          <div className="absolute bottom-[12%] left-[18%] h-24 w-[28rem] rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.35),rgba(255,255,255,0))] opacity-50 blur-2xl animate-wave" />
        </>
      )}
      <div className={`absolute inset-x-0 top-0 h-40 ${theme === 'dark' ? 'bg-gradient-to-b from-white/[0.04] to-transparent' : 'bg-gradient-to-b from-white/10 to-transparent'} animate-shimmer`} />
    </div>
  );
}
