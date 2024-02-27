
import React, { useState, useEffect, memo } from 'react';
import { Galleria } from 'primereact/galleria';
import { PhotoService } from '../service/PhotoService';
import { Tag } from 'primereact/tag';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';

export default memo(function GalleryImages({product}) {
    const [images, setImages] = useState([]);
    const [inside, setInside] = useState(false);

    const responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];
    
    useEffect(() => {
        //PhotoService.getImages().then(data => setImages(data));
        setImages(product.images);
    }, [])

    const itemTemplate = (item) => {
        return <img src={`https://res.cloudinary.com/dtydggyis/image/upload/${Object.values(item)[0]}`} alt="product image" style={{ width: '100%', objectFit: "contain",minHeight: "450px", maxWidth: "450px", display: 'block' }} />
    }

    return (
        <div style={{minHeight: "450px",}} className="w-100 md:w-7 " >
            <Galleria value={images} showThumbnails={false} showIndicators showIndicatorsOnItem={inside} indicatorsPosition="bottom" item={itemTemplate}/>
               
        </div>
    )
})
        