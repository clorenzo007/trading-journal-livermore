import mikiLogo from "../../assets/mikiLogo";

/**
 * Faint, full-viewport logo watermark. Purely decorative: fixed behind the
 * page content so opaque cards/panels naturally cover it where they overlap.
 */
export default function Watermark() {
  return (
    <img
      src={mikiLogo}
      alt=""
      aria-hidden="true"
      className="fixed inset-0 m-auto w-[560px] h-[560px] max-w-[65vw] max-h-[65vw] object-contain opacity-[0.035] grayscale pointer-events-none select-none z-0"
    />
  );
}
