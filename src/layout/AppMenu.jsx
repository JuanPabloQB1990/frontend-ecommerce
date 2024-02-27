import React, { useEffect, useRef, useState } from 'react';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import useUser from '../hooks/useUser';
import verifyTokenExpired from '../helpers/verifyTokenExpired';
import useProduct from '../hooks/useProduct';

export default function AppMenu() {

    const toast = useRef(null);
    const navigate = useNavigate();
    const { auth } = useUser()
    const { categories, getCategories, loading } = useProduct()

    useEffect(() => {
        console.log('render menu');
        
        getCategories(auth.token)
    }, []);

    const items = [
        {
            label: 'Categorias',
            items: categories?.map(c => {
                return {
                 label: c.name,
                 command: () => {
                     navigate(`/client-products/${c.id}`)
                 }
             }})
        },
        {
            label: 'Profile',
            items: [ 
                
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    visible: verifyTokenExpired(auth.token) ? true : false,
                    command: () => {
                        localStorage.removeItem('authentication')
                        navigate("/login")
                    }
                },
                {
                    label: 'Products',
                    icon: 'pi pi-plus',
                    visible: auth.rol === process.env.ROL_ADMIN.toLowerCase() ? true : false,
                    command: () => {
                        navigate("/admin-products")
                    }

                },
                {
                    label: 'Users',
                    icon: 'pi pi-user',
                    visible: auth.rol === process.env.ROL_ADMIN.toLowerCase() ? true : false,
                    command: () => {
                        navigate("/admin-clients")
                    }

                }
            ]
        }
    ];

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Menu model={items} />
        </div>
    )
}
        
        
