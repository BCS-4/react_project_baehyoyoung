import { FC, useState } from 'react';

export interface NftCardProps {
    image: string;
    name: string;
    tokenId: number;
}

const NftCard = ({image, name, tokenId}:NftCardProps) => {
    const [isHover, setIsHover] = useState<boolean>(false);

    const onMouseEnter = () => {
        setIsHover(true);
    };

    const onMouseLeave = () => {
        setIsHover(false);
    };

    return (
        <div>
            <li className="relative" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} >
                <img src={image} alt={name} />
                <div className="font-semibold mt-1">{name}</div>
                {isHover && (
                    <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50"></div>
                )}
            </li>
        </div>
    );
};

export default NftCard;