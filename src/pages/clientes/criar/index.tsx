import { Input } from '@/components/Input'
import { InputCallback } from '@/components/InputCallback'
import { InputMask } from '@/components/InputMask'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
const DEFAULT_MESSAGE_RULE = "Campo obrigatório."

function isCpfOrCnpj(value: string) {
    const digitos = value.replace(/\D/g, '')
    return digitos.length === 11 || digitos.length === 14
}

const regras = z.object({
    nome: z.string().min(1, DEFAULT_MESSAGE_RULE),
    email: z.email(DEFAULT_MESSAGE_RULE),
    cpfcnpj: z.string()
        .min(1, DEFAULT_MESSAGE_RULE)
        .max(18, "Limite de 18 caracteres")
        .refine(isCpfOrCnpj, "Informe um CPF ou CNPJ válido."),
    sexo: z.string().min(1, DEFAULT_MESSAGE_RULE).max(1, "Limite de 1 caracteres."),
    cep: z.string().min(1, DEFAULT_MESSAGE_RULE)
        .max(9, "Cep inválido."),
    rua: z.string().min(1, DEFAULT_MESSAGE_RULE),
    bairro: z.string().min(1, DEFAULT_MESSAGE_RULE),
    cidade: z.string().min(1, DEFAULT_MESSAGE_RULE),
    estado: z.string().min(1, DEFAULT_MESSAGE_RULE),
    numero: z.string().min(1, DEFAULT_MESSAGE_RULE),
    complemento: z.string().min(1, DEFAULT_MESSAGE_RULE),
})

export type FormType = z.infer<typeof regras>

export default function CadastrarClientes() {
    const [showModal, setShowModal] = useState(false)

    const {
        handleSubmit,
        register,
        formState: { errors },
        setError,   
        watch,
        setValue,
        reset
    } = useForm<FormType>({
        resolver: zodResolver(regras),
    })
    
    async function onSubmit(data: FormType){
        const response = await fetch('/api/create/clientes', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const json = await response.json()

        //showModal === false && setShowModal(!showModal)

        if(response){
            const message = "Usuário cadastrado com Sucesso"
        } else {
            const message = "Não foi possível cadastrar o usuário"
        }
        
    }

    async function buscaCep(){
        const cep = watch('cep')
        if(cep.length !== 9) {
            setError('cep', { message: 'Cep inválido.'})
            return 
        }
        try {
            const busca = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const response = await busca.json()
            if(response?.erro){
                return
            }
            setValue('bairro', response.bairro ?? '')
            setValue('cidade', response.localidade ?? '')
            setValue('estado', response.uf ?? '')
            setValue('rua', response.logradouro ?? '')
        } catch (error) {
            console.error('error', error)
        }
    }

    return(
        <>
            <h1 className='text-center'>Cadastrar Cliente</h1>
            <div className='w-full flex items-center justify-center px-10'>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className='grid grid-cols-12 space-y-6 space-x-2'>
                    <InputMask 
                        errors={errors}
                        label='CPF/CNPJ'
                        masks='cpfcnpj'
                        name='cpfcnpj'
                        register={register}
                        required
                        size={3}
                        placeholder='Digite o seu CPF ou CNPJ'
                    />
                    <Input 
                        errors={errors}
                        label='Nome'
                        name='nome'
                        register={register}
                        required
                        size={9}
                    />
                    <Input 
                        errors={errors}
                        label='Email'
                        name='email'
                        register={register}
                        required
                        size={9}
                    />
                    <Input 
                        errors={errors}
                        label='Sexo'
                        name='sexo'
                        register={register}
                        required
                        size={3}
                    />
                    <InputCallback
                        errors={errors}
                        label='Cep'
                        name='cep'
                        register={register}
                        required
                        size={3}
                        masks='cep'
                        funcaoParaSerMostrada={buscaCep}
                        placeholder='Digite o CEP'
                    />
                    <Input 
                        errors={errors}
                        label='Rua'
                        name='rua'
                        register={register}
                        required
                        size={9}
                    />
                    <Input 
                        errors={errors}
                        label='Número'
                        name='numero'
                        register={register}
                        required
                        size={4}
                    />
                    <Input 
                        errors={errors}
                        label='Complemento'
                        name='complemento'
                        register={register}
                        required
                        size={8}
                    />
                    <Input 
                        errors={errors}
                        label='Bairro'
                        name='bairro'
                        register={register}
                        required
                        size={5}
                    />
                    <Input 
                        errors={errors}
                        label='Cidade'
                        name='cidade'
                        register={register}
                        required
                        size={5}
                    />
                    <Input 
                        errors={errors}
                        label='Estado'
                        name='estado'
                        register={register}
                        required
                        size={2}
                    />
                    <div className="col-span-12">
                        <div className="flex items-center justify-end pr-2">
                            <button className='mt-10 border px-4 py-2 rounded-md cursor-pointer hover:bg-zinc-300 hover:text-zinc-900'>Enviar</button>
                        </div>
                    </div>
                </form>
            </div>
            {
                showModal && (
                    <div className='bg-black/30 z-999 h-screen w-full flex items-center justify-center fixed top-0 left-0'>
                        <div className='relative text-bolder text-[1.3rem] gap-5 bg-white w-100 h-50 flex flex-col items-center justify-center text-black rounded-xl border border-slate-400 shadow-md shadow-gray-700'>
                            <h1>Confimação de Registro</h1>
                            <div className='flex flex-col items-center justify-center gap-5'>
                                <p className='text-gray-400 text-sm'>{/*MENSAGEM DE RETORNO ONSUBMIT*/}</p>
                                <button className='rounded-md border px-3 border border-green-400 text-green-400 cursor-pointer' onClick={() => { 
                                    setShowModal(!showModal) 
                                    reset()
                                }}>OK</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
