import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react'
import { classNames } from 'primereact/utils';
import UploadImageProfile from '../components/UploadImageProfile';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import useUser from '../hooks/useUser';
import Layout from '../layout/layout';
import Image from '../../public/image.png'
import { Toast } from "primereact/toast";

const Profile = () => {

    let emptyClient = {
        id: null,
        name: "",
        image:[],
        email: "",
        country: "",
        city: "",
        rol: ""
    };
    
    const [productDialog, setClientDialog] = useState(false);
    const [client, setClient] = useState(emptyClient);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef(null);
    const { id } = useParams()
    const { user, getUserById, updateUserByClient, message, loading } = useUser()

    if (!user) {
        console.log("mostrar loading perfil");
    }
    console.log(user);
    useEffect(() => {
        console.log("render profile");
    }, []); 

    useEffect(() => {
        getUserById(id)
    }, [productDialog]);

    const openEdit = () => {
        setClientDialog(true)
        setClient(user)
    }
    console.log("re render profile...");
    const hideDialog = () => {
        setSubmitted(false);
        setClientDialog(false);
        setClient(emptyClient)
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        
        let _client = { ...client };
        _client[`${name}`] = val;
        setClient(_client);
    };

    const saveClient = async() => {
        setSubmitted(true);
        
        if (client.name.trim()) {
            
            await updateUserByClient(client)

            setTimeout(() => {
                setClientDialog(false);
            }, 1000);

            toast.current.show({
                severity: message.type,
                summary: message.title,
                detail: message.msg,
                life: 3000,
            });
        }

    };
    
    const header = (
        <img alt="Card"  src={user.image ? `https://res.cloudinary.com/dtydggyis/image/upload/${Object.values(JSON.parse(user.image)[0])[0]}`: Image}/>
    );

    const footer = (
        <>
            <Button label="Editar" className='w-full' icon="pi pi-pencil" onClick={openEdit}/>
        </>
    );

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" loading={loading} icon="pi pi-check" onClick={saveClient} />
        </React.Fragment>
    );


  return (
    <Layout>
        <Toast ref={toast} />
        <div className="card flex justify-content-center">
            <Card title={user.name} subTitle={user.email} footer={footer} header={header} className="md:w-25rem">
                <h5 className="m-0">
                    {user.country} - {user.city}
                </h5>
            </Card>
        </div>
        <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalles del Cliente" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
            {client.image && <img src={user.image ? `https://res.cloudinary.com/dtydggyis/image/upload/${Object.values(JSON.parse(user.image)[0])[0]}`: Image} alt={client.image} className="user-image block m-auto pb-3 border-circle w-9rem" />}
            <div className="field">
                <label htmlFor="name" className="font-bold">
                    Nombre
                </label>
                <InputText id="name" value={client.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.name })} />
                {submitted && !client.name && <small className="p-error">Nombre es requerido.</small>}
            </div>
            <div className="field">
                <label htmlFor="email" className="font-bold">
                    Correo
                </label>
                <InputText type='email' id="email" value={client.email} onChange={(e) => onInputChange(e, 'email')} required />
                {submitted && !client.email && <small className="p-error">email es requerido.</small>}
            </div>

            <div className="formgrid grid">
                <div className="field col">
                    <label htmlFor="country" className="font-bold">
                        Pais
                    </label>
                    <InputText id="country" value={client.country} onChange={(e) => onInputChange(e, 'country')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.country })}/>
                    {submitted && !client.country && <small className="p-error">Pais es requerido.</small>}
                </div>
                <div className="field col">
                    <label htmlFor="city" className="font-bold">
                        Ciudad
                    </label>
                    <InputText id="city" value={client.city} onChange={(e) => onInputChange(e, 'city')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.city })}/>
                    {submitted && !client.city && <small className="p-error">Ciudad es requerido.</small>}
                </div>
            </div>
            <UploadImageProfile setClient={setClient} client={client}/>
        </Dialog>
    </Layout>
  )
}

export default Profile
