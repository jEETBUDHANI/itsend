import { GlowingShadow } from "@/components/ui/glowing-shadow";

export default function GlowingShadowDemo() {
  return (
    <div className="flex items-center justify-center p-6">
      <GlowingShadow className="w-full max-w-xl">
        <div className="pointer-events-none z-10 m-8 text-center text-5xl leading-none font-semibold tracking-tight text-white">
          Glowing Shadow
        </div>
      </GlowingShadow>
    </div>
  );
}
