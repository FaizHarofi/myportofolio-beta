import { FaLocationArrow } from "react-icons/fa6";

import MagicButton from "./MagicButton";

const Footer = ({
  socials,
}: {
  socials: { id: number; img: string; link: string | null }[];
}) => {
  return (
    <footer
      className="relative w-full pt-20 pb-10 overflow-hidden"
      id="contact"
    >
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none select-none">
        <img
          src="/footer-grid.svg"
          alt="grid"
          className="w-full h-full opacity-50"
        />
      </div>

      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          Ready to take <span className="text-purple">your</span> digital
          presence to the next level?
        </h1>
        <p className="text-white md:mt-10 my-5 text-center">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <a href="mailto:faizsjawa@gmail.com">
          <MagicButton
            title="Let's get in touch"
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center">
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright © 2026 Faiz Harofi
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {socials.map((info) => {
            const inner = (
              <div className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300">
                <img src={info.img} alt="icons" width={20} height={20} />
              </div>
            );
            return info.link ? (
              <a
                key={info.id}
                href={info.link}
                target="_blank"
                rel="noreferrer"
                aria-label={hostname(info.link)}
              >
                {inner}
              </a>
            ) : (
              <span key={info.id}>{inner}</span>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "") || url;
  } catch {
    return url;
  }
}

export default Footer;
