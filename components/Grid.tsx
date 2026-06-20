import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import type { GridItem } from "@/lib/data";

const Grid = ({ items }: { items: GridItem[] }) => {
  return (
    <section id="about">
      <BentoGrid className="w-full py-20">
        {items.map((item, i) => (
          <BentoGridItem
            id={item.id}
            key={i}
            title={item.title}
            description={item.description}
            className={item.className}
            img={item.img}
            imgClassName={item.imgClassName}
            titleClassName={item.titleClassName}
            spareImg={item.spareImg}
          />
        ))}
      </BentoGrid>
    </section>
  );
};

export default Grid;
