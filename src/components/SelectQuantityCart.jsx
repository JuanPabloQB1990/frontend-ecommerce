import React, { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";

export default function SelectQuantityCart({ quantity}) {
    const [value, setValue] = useState(1);
    const [items, setItems] = useState([]);

    const search = (event) => {
        let _items = [...Array(10).keys()];
        setItems(event.query ? [...Array(quantity).keys()].map(item => event.query + '-' + item) : _items);
    }

    return (
        <div className="card flex justify-content-center">
            <AutoComplete value={value} suggestions={items} completeMethod={search} onChange={(e) => setValue(e.value)} dropdown />
        </div>
    )
}
        
        
        