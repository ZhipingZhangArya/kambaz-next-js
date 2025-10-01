import Image from "next/image";

export default function Float() {
  return (
    <div id="wd-float-divs">
      <h2>Float</h2>
      
      {/* Text wrapping around images */}
      <div>
        <Image className="wd-float-right"
          src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"
          alt="Starship rocket"
          width={100}
          height={100} />
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius hic repellat quibusdam, voluptatem aliquam itaque ad? Debitis, quasi. Quidem, sequi doloremque, deleniti quae facere repudiandae, inventore iste asperiores et voluptas. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius hic repellat quibusdam, voluptatem aliquam itaque ad? Debitis, quasi. Quidem, sequi doloremque, deleniti quae facere repudiandae, inventore iste asperiores et voluptas.
        
        <Image className="wd-float-left"
          src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"
          alt="Starship rocket"
          width={100}
          height={100} />
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius hic repellat quibusdam, voluptatem aliquam itaque ad? Debitis, quasi. Quidem, sequi doloremque, deleniti quae facere repudiandae, inventore iste asperiores et voluptas. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius hic repellat quibusdam, voluptatem aliquam itaque ad? Debitis, quasi. Quidem, sequi doloremque, deleniti quae facere repudiandae, inventore iste asperiores et voluptas.
        
        <Image className="wd-float-right"
          src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"
          alt="Starship rocket"
          width={100}
          height={100} />
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius hic repellat quibusdam, voluptatem aliquam itaque ad? Debitis, quasi. Quidem, sequi doloremque, deleniti quae facere repudiandae, inventore iste asperiores et voluptas. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius hic repellat quibusdam, voluptatem aliquam itaque ad? Debitis, quasi. Quidem, sequi doloremque, deleniti quae facere repudiandae, inventore iste asperiores et voluptas.
        
        <Image className="wd-float-left"
          src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"
          alt="Starship rocket"
          width={100}
          height={100} />
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius hic repellat quibusdam, voluptatem aliquam itaque ad? Debitis, quasi. Quidem, sequi doloremque, deleniti quae facere repudiandae, inventore iste asperiores et voluptas. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius hic repellat quibusdam, voluptatem aliquam itaque ad? Debitis, quasi. Quidem, sequi doloremque, deleniti quae facere repudiandae, inventore iste asperiores et voluptas.
        <div className="wd-float-done"></div>
      </div>

      {/* Horizontal layout with colored divs */}
      <div>
        <div className="wd-float-left wd-dimension-portrait wd-bg-color-yellow">
          Yellow </div>
        <div className="wd-float-left wd-dimension-portrait wd-bg-color-blue wd-fg-color-white">
          Blue </div>
        <div className="wd-float-left wd-dimension-portrait wd-bg-color-red">
          Red </div>
        <Image className="wd-float-right"
          src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg"
          alt="Starship rocket"
          width={100}
          height={100} />
        <div className="wd-float-done"></div>
      </div>
    </div>
  );
}
