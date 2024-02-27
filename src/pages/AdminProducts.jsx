import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import Layout from '../layout/layout.jsx';
import UploadImagesProduct from '../components/UploadImagesProduct.jsx';
import useProduct from '../hooks/useProduct.js';
import useUser from '../hooks/useUser.js';

export default function AdminProducts() {
    let emptyProduct = {
        id: null,
        name: '',
        images: [],
        description: '',
        category: null,
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };

    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(emptyProduct);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [totalSize, setTotalSize] = useState(0);

    const { postProduct, getCategories, categories, getProducts, deleteProductById, updateProductById, deleteProducts } = useProduct()
    const { auth } = useUser()

    const toast = useRef(null);
    const dt = useRef(null);

    console.log("re rendering admin...");
    useEffect(() => {
        getProducts(auth.token).then((data) => setProducts(data))
        console.log("render admin-products");
    }, [submitted]);

    useEffect(() => {
        getCategories(auth.token)
        console.log("obtener category");
    }, [auth]);
    
    const formatCurrency = (value) => {
        return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    };
    
    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };
    
    const saveProduct = async() => {
        setSubmitted(true);
        
        if (product.name.trim()) {

            if (product.id) {
                updateProductById(product, auth.token);
                toast.current.show({ severity: 'success', summary: 'Producto editado', detail: "satisfactoriamente", life: 3000 });
            } else {
                //_product.id = createId();
                await postProduct(product, auth.token)
                toast.current.show({ severity: 'success', summary: 'Producto guardado', detail: "satisfactoriamente", life: 3000 });
            }

            setSubmitted(false);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product) => {
        let _product = {...product, images:[]}
        setProduct(_product);
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async() => {
        let _products = products.filter((val) => val.id !== product.id);

        deleteProductById(product.id, auth.token)
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Producto eliminado', detail: "satisfactoriamente", life: 3000 });

    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));

        const ids = []

        selectedProducts.forEach(prod => {
            ids.push(prod.id);
        });

        const ObjecIds = {
            ids
        }
        
        deleteProducts(ObjecIds, auth.token)
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Productos eliminados', detail: 'satisfactoriamente', life: 5000 });
    };

    const onCategoryChange = (e) => {
        product['category'] = e.value;
        setProduct(product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;
        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;
        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
            </React.Fragment>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={`https://res.cloudinary.com/dtydggyis/image/upload/${Object.values(rowData.images[0])[0]}`} alt={Object.values(rowData.images[0])[0]} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const defineInventoryStatus = (product) => {

        if (product.quantity < 10) {
            product["inventoryStatus"] = 'OUTOFSTOCK'
            return 'OUTOFSTOCK';
        }
        if (product.quantity < 20 && product.quantity >= 10) {
            product["inventoryStatus"] = 'LOWSTOCK'
            return 'LOWSTOCK'; 
        }
        if (product.quantity >= 20) {
            product["inventoryStatus"] = 'INSTOCK'
            return 'INSTOCK';
        }
        
    }

    const getSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };
    
    const statusBodyTemplate = (rowData) => {
        return <Tag value={defineInventoryStatus(rowData)} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Administra tus Productos</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );
        
    return (
        <Layout>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="id" header="Id" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="images" header="Image" body={imageBodyTemplate} ></Column>
                    <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '50%' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.images > 0 && <img src={`https://res.cloudinary.com/dtydggyis/image/upload/${Object.values(product.images[0])[0]}`} alt="image proudct" className="product-image block m-auto pb-3 w-6" />}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Nombre
                    </label>
                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Descripcion
                    </label>
                    <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                </div>

                <div className="field">
                    <label className="mb-3 font-bold">Categoria</label>
                    <div className="formgrid grid">
                        {categories?.map(c => (
                            
                            <div key={c.id} className="field-radiobutton col-6">
                                <RadioButton inputId={`category${c.id}`} name="category" value={`${c.id}`} onChange={onCategoryChange} checked={product.category === c.name} />
                                <label htmlFor={`category${c.id}`}>{c.name}</label>
                            </div>
                        ))}
                        
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Precio
                        </label>
                        <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="COP" locale="es-CO" />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            Cantidad en Stock
                        </label>
                        <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                    </div>
                </div>
                <div className="formgrid grid">
                    <UploadImagesProduct setProduct={setProduct} product={product}/>

                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Seguro deseas eliminar <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Estas seguro que deseas eliminar los productos seleccionados?</span>}
                </div>
            </Dialog>
        </Layout>
    );
}
        
