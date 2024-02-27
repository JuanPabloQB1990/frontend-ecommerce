import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { DataScroller } from "primereact/datascroller";
import { Rating } from "primereact/rating";
import { Card } from "primereact/card";
import useUser from "../hooks/useUser";
import useProduct from "../hooks/useProduct";
import { AutoComplete } from "primereact/autocomplete";
import Layout from "../layout/layout";

export default function CartProducts() {
  const [items, setItems] = useState([]);
  const [submmit, setSubmmit] = useState(false);
  const [priceTotal, setPriceTotal] = useState(0);

  const ds = useRef(null);

  const {
    getProductsCartByIdClient,
    productsCart,
    updateQuantityProductCart,
    deleteProductCart,
  } = useProduct();
  const { auth } = useUser();

  const handlerQuantity = async (value, id, price) => {
    setSubmmit(true);
    await updateQuantityProductCart(id, value, price);
    setSubmmit(false);
    sumTotalProducts();
  };

  const handleDelete = async (id) => {
    setSubmmit(true);
    await deleteProductCart(id);
    setSubmmit(false);
    sumTotalProducts();
  };

  // funcion para calcular el resultado de todos los productos a comprar
  const sumTotalProducts = () => {
    const totalProducts = productsCart.reduce((acc, prod) => {
      console.log(prod);
      return acc + prod.total;
    }, 0);

    setPriceTotal(totalProducts);
  };
  console.log(priceTotal);

  useEffect(() => {
    sumTotalProducts();
  }, [productsCart]);

  useEffect(() => {
    getProductsCartByIdClient(auth.id, auth.token);

    console.log("render carrito");
    getTotalProductsCart();
  }, [submmit, auth]);

  const getTotalProductsCart = () => {
    const priceTotal = productsCart.reduce((acum, prod) => {
      return acum + prod.total;
    }, 0);

    setPriceTotal(priceTotal);
  };

  console.log(productsCart);
  const searchSelect = () => {
    const arrQuantity = [];

    productsCart.map((prod) => {
      for (let index = 1; index < prod.quantity_product + 1; index++) {
        arrQuantity.push(index);
      }

      setItems(arrQuantity);
    });
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
  };

  const itemTemplate = (data) => {
    return (
      <div className="flex flex-column w-full lg:flex-row lg:align-items-start p-4 gap-4">
        <img
          className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
          src={`https://res.cloudinary.com/dtydggyis/image/upload/${
            Object.values(data.images[0])[0]
          }`}
          alt="product cart"
        />
        <div className="flex flex-column md:flex-row justify-content-between align-items-center xl:align-items-start md:flex-1 gap-4">
          <div className="flex flex-row justify-content-around w-full md:flex-column align-items-center md:align-items-start gap-3">
            <div className="flex flex-column gap-1">
              <div className="text-2xl font-bold text-900">
                {data.name_product}
              </div>
              <div className="text-700">{data.description}</div>
            </div>
            <div className="flex flex-column gap-2">
              <Rating value={data.rating} readOnly cancel={false}></Rating>
              <span className="flex align-items-center gap-2">
                <i className="pi pi-tag product-category-icon"></i>
                <span className="font-semibold">{data.name_category}</span>
              </span>
            </div>
          </div>
          <div className="flex flex-column justify-content-around w-full md:flex-column md:align-items-end gap-4 md:gap-2">
            <span className="text-2xl font-semibold">
              {formatCurrency(data.total)}
            </span>
            <Button
              onClick={() => handleDelete(data.id)}
              icon="pi pi-trash"
              severity="danger"
              label="Delete"
              className="w-full md:max-w-8rem"
            />

            <AutoComplete
              value={data.quantity_cart}
              suggestions={items}
              completeMethod={searchSelect}
              onChange={(e) => handlerQuantity(e.value, data.id, data.price)}
              dropdown
              className="w-full md:max-w-8rem"
            />
          </div>
        </div>
      </div>
    );
  };

  const footer = (
    <Button
      type="text"
      icon="pi pi-plus"
      label="Load"
      onClick={() => ds.current.load()}
    />
  );

  return (
    <Layout>
      <div className="flex flex-column md:flex-row md:justify-content-between md:gap-4 h-screen w-full">
        <div className="md:w-3 h-20rem">
          <Card title="Resumen de Compra">
            <p className="m-0">Productos: {productsCart.length}</p>
            <div className="flex flex-row justify-content-between mt-2">
              <p>Total: </p>
              <p>{formatCurrency(priceTotal)}</p>
            </div>
            <Button className="w-full" label="Continuar Compra" raised />
          </Card>
        </div>
        <div className="md:w-9">
          <DataScroller
            value={productsCart}
            itemTemplate={itemTemplate}
            rows={5}
            loader
            footer={footer}
            scrollHeight="700px"
            header="Carrito de Compras"
          />
        </div>
      </div>
    </Layout>
  );
}
