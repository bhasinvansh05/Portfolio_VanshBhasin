
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title?: string;
  images?: string[];
  Icon?: LucideIcon;
}

const Card = ({ title = "Hover over", images = [], Icon }: CardProps) => {
  return (
    <section className="group flex flex-col items-center justify-center w-full h-full">
      <div className="file relative w-60 h-40 cursor-pointer origin-bottom [perspective:1500px]">
        <div className="work-5 bg-amber-600 w-full h-full origin-top rounded-2xl rounded-tl-none group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-20 after:h-4 after:bg-amber-600 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[15px] before:left-[75.5px] before:w-4 before:h-4 before:bg-amber-600 before:[clip-path:polygon(0_35%,0%_100%,50%_100%);]" />
        
        {/* Paper 3 */}
        <div className="work-4 absolute inset-1 bg-zinc-400 rounded-2xl transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)] overflow-hidden">
          {images[2] ? <img src={images[2]} alt="Project 3" className="w-full h-full object-cover" /> : null}
        </div>
        
        {/* Paper 2 */}
        <div className="work-3 absolute inset-1 bg-zinc-300 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)] overflow-hidden">
          {images[1] ? <img src={images[1]} alt="Project 2" className="w-full h-full object-cover" /> : null}
        </div>
        
        {/* Paper 1 */}
        <div className="work-2 absolute inset-1 bg-zinc-200 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)] overflow-hidden shadow-inner">
          {images[0] ? <img src={images[0]} alt="Project 1" className="w-full h-full object-cover" /> : null}
        </div>
        
        {/* Cover */}
        <div className="work-1 absolute bottom-0 bg-gradient-to-t from-amber-500 to-amber-400 w-full h-[156px] rounded-2xl rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[146px] after:h-[16px] after:bg-amber-400 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[10px] before:right-[142px] before:size-3 before:bg-amber-400 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);] transition-all ease duration-300 origin-bottom flex items-center justify-center pb-4 group-hover:shadow-[inset_0_20px_40px_#fbbf24,_inset_0_-20px_40px_#d97706] group-hover:[transform:rotateX(-46deg)_translateY(1px)]">
          {Icon && <Icon className="w-12 h-12 text-amber-100 opacity-60 drop-shadow-md" strokeWidth={1.5} />}
        </div>
      </div>
      <p className="text-xl sm:text-2xl pt-6 opacity-80 font-medium tracking-tight text-white transition-opacity duration-300 group-hover:opacity-100">{title}</p>
    </section>
  );
}

export default Card;
