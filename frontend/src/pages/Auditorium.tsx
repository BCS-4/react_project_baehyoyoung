import React from 'react';
import { FC } from 'react';

interface artTile {
    text: string;
    color: string;
    imageUrl: string;
}

const Auditorium:FC = () => {
    const artTiles: artTile[] = [
        {
            text:"There is no place like 127.0.0.1.",
            color:"bg-[rgb(239,148,53)]",
            imageUrl: "https://www.nyc.gov/assets/home/images/press_release/2022/06/pr393-22.jpg",
        },
        {
            text:"It works on my machine.",
            color:"bg-[rgb(234,100,95)]",
            imageUrl: "https://blog.jobbio.com/wp-content/uploads/2018/02/Screen-Shot-2018-02-08-at-12.51.33.png",
        },
        {
            text:"Code never lies.",
            color:"bg-[rgb(240,164,152)]",
            imageUrl: "https://images.squarespace-cdn.com/content/v1/5845d1c3e4fcb5c4ed9162ef/281f0f01-f79f-441d-92bb-85201f3af520/IMG_8567.jpg",
        },
        {
            text:"Keep calm and sudo on.",
            color:"bg-[rgb(139,217,198)]",
            imageUrl: "https://s3-prod.crainsnewyork.com/iStock-1308432203_1.jpg",
        },
        {
            text:"My code WORKS, I have no idea why.",
            color:"bg-[rgb(241,196,58)]",
            imageUrl: "https://static01.nyt.com/images/2022/09/19/nyregion/19ny-rto1/19ny-rto1-jumbo.jpg?quality=75&auto=webp",
        },
        {
            text:"Never forget. Git commit, Git push.",
            color:"bg-[rgb(255,255,255)]",
            imageUrl: "https://media.npr.org/assets/img/2022/08/12/gettyimages-1391306359-2de7a4689dedd8f981b2d7ee3c893afcf52703cc-s1100-c50.jpg",
        },
        {
            text:"Bjarne Stroustrup",
            color:"bg-[rgb(0,0,0)]",
            imageUrl: "https://imageio.forbes.com/specials-images/imageserve/5eca97a0462b6500078da0f1/New-York--People-and-traffic-disappeared-from-Times-Square-for-impact-of-COVID-19-in/960x0.jpg?format=jpg&width=960",
        },


    ];
    return (
        <div>
          {
              artTiles.map((tile, index) => (
                  <div key = {index} className={`${tile.color} h-1/5 flex ${index%2 ===0? 'flex-row-reverse':''}`}>
                    <div className={`w-2/5 ${index % 2===0? 'ml-auto':''}`}>
                        <img className="max-w-full max-h-full object-contain"
                            src={tile.imageUrl} 
                            alt={`Proverb ${index+1}`}                         
                        />                        
                    </div>                        
                    <p className="text-3xl font-bold m-8">{tile.text}</p>
                  </div>
              ))
          }
  
        </div>      
      );
  }
  
  export default Auditorium;